#!/usr/bin/env node
/**
 * Sincroniza el catálogo de zapatos de donpedrohabana.com → content/catalogo.json
 * (diseno.md §5.2).
 *
 *   node scripts/sync-catalogo.mjs              sincroniza (si falla, conserva el JSON anterior y sale con 0)
 *   node scripts/sync-catalogo.mjs --estricto   igual, pero si falla sale con 1 (para CI)
 *   node scripts/sync-catalogo.mjs --informe    además lista los modelos sin tacón/color por categoría
 *   node scripts/sync-catalogo.mjs --solo-informe   no descarga: informe sobre el catalogo.json actual
 *   node scripts/sync-catalogo.mjs --reetiquetar    no descarga: reetiqueta el catalogo.json actual y lo guarda
 *                                                   (tras editar lib/etiquetado.ts o content/etiquetas-manuales.ts)
 *
 * Fuente: listados de categoría de PrestaShop pedidos con
 *   Accept: application/json + X-Requested-With: XMLHttpRequest
 * que devuelven { pagination, rendered_products (HTML) }.
 *
 * El etiquetado vive en lib/etiquetado.ts y las correcciones en content/etiquetas-manuales.ts.
 * Node 18 no importa .ts, así que se transpilan en memoria con `typescript` (ya es devDependency)
 * y se cargan como módulos ESM: una sola fuente de verdad para la app, los tests y este script.
 */
import { readFile, writeFile, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { File as FileNode } from "node:buffer";
import path from "node:path";

// cheerio 1.x (vía undici) espera un File global, que Node 18 no expone.
if (typeof globalThis.File === "undefined") globalThis.File = FileNode;

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = path.join(RAIZ, "content", "catalogo.json");
const ARGS = new Set(process.argv.slice(2));
const ESTRICTO = ARGS.has("--estricto");
const INFORME = ARGS.has("--informe") || ARGS.has("--solo-informe");
const SOLO_INFORME = ARGS.has("--solo-informe");
const REETIQUETAR = ARGS.has("--reetiquetar");

const BASE = process.env.SYNC_CATALOGO_BASE || "https://donpedrohabana.com"; // override solo para probar fallos
const USER_AGENT = "DonPedroAsesor/1.0 (+landing)";
const PAUSA_MS = 500;
const REINTENTOS = 2;
const TIMEOUT_MS = 20000;
const POR_PAGINA = 200; // PrestaShop lo limita (hoy sirve 32); se pagina igualmente.
const MAX_PAGINAS = 30; // tope de seguridad por categoría
const MINIMO_PRODUCTOS = 100; // por debajo, algo va mal: no se sobrescribe el catálogo

/** Selectores centralizados (diseno.md §8: si cambia el tema, se toca solo aquí). */
const SEL = {
  articulo: "article.js-product-miniature",
  attrIdProducto: "data-id-product",
  attrIdAtributo: "data-id-product-attribute",
  nombre: "h3 a[title]",
  enlace: "a.product_img_link",
  imagen: "img[data-src]",
  precio: "span.price",
  precioAnterior: ".regular-price",
  descripcion: ".product-desc",
};

// ---------- utilidades ----------
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log("[sync-catalogo]", ...a);
const aviso = (...a) => console.warn("[sync-catalogo] AVISO:", ...a);

/** "1.234,50 €" → 1234.5 ; null si no se puede leer. */
function parsearPrecio(texto) {
  if (!texto) return null;
  const limpio = String(texto).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

/** Quita el fragmento "#/434-talla_senora-35" de la URL de la ficha. */
function limpiarUrl(url) {
  return String(url || "").split("#")[0].trim();
}

async function cargarTs(relativo) {
  const ts = (await import("typescript")).default;
  const fuente = await readFile(path.join(RAIZ, relativo), "utf8");
  const { outputText } = ts.transpileModule(fuente, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020, verbatimModuleSyntax: false },
    fileName: relativo,
  });
  if (/^\s*import\s+(?!type\b)[^;]*from\s/m.test(outputText)) {
    throw new Error(`${relativo} importa valores; debe ser autocontenido (solo "import type").`);
  }
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

async function pedirJson(url) {
  let ultimoError;
  for (let intento = 0; intento <= REINTENTOS; intento++) {
    if (intento > 0) {
      aviso(`reintento ${intento}/${REINTENTOS} → ${url}`);
      await dormir(PAUSA_MS * 2 * intento);
    }
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": USER_AGENT,
        },
        redirect: "follow",
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const texto = await res.text();
      let json;
      try {
        json = JSON.parse(texto);
      } catch {
        throw new Error(`la respuesta no es JSON (¿cambió PrestaShop?): ${texto.slice(0, 80)}…`);
      }
      if (typeof json.rendered_products !== "string" || !json.pagination) {
        throw new Error("JSON sin rendered_products/pagination");
      }
      return json;
    } catch (e) {
      ultimoError = e;
    }
  }
  throw new Error(`${url}: ${ultimoError?.message ?? ultimoError}`);
}

function parsearMiniaturas($, html, idCategoria) {
  const doc = $.load(html);
  const out = [];
  doc(SEL.articulo).each((_, el) => {
    const a = doc(el);
    const id = Number.parseInt(a.attr(SEL.attrIdProducto) ?? "", 10);
    const idAtributo = Number.parseInt(a.attr(SEL.attrIdAtributo) ?? "0", 10) || 0;
    const nombre = (a.find(SEL.nombre).first().attr("title") ?? "").trim();
    const url = limpiarUrl(a.find(SEL.enlace).first().attr("href"));
    // home_default_2x (640px, ~25 KB): nítida en pantallas retina sin llegar al peso de large_default.
    const imagen = (a.find(SEL.imagen).first().attr("data-src") ?? "").trim().replace("-home_default/", "-home_default_2x/");
    const precio = parsearPrecio(a.find(SEL.precio).first().text());
    const precioAnterior = parsearPrecio(a.find(SEL.precioAnterior).first().text());
    const descripcion = a.find(SEL.descripcion).first().text().replace(/\s+/g, " ").trim();
    if (!Number.isFinite(id) || !nombre || !url || precio === null) {
      aviso(`miniatura incompleta en categoría ${idCategoria} (id=${id}, nombre="${nombre}"): se omite`);
      return;
    }
    const p = { id, idAtributo, nombre, url, imagen, precio, descripcion, categorias: [idCategoria] };
    if (precioAnterior !== null && precioAnterior > precio) p.precioAnterior = precioAnterior;
    out.push(p);
  });
  return out;
}

async function descargarCategoria($, id, slug) {
  const productos = [];
  let total = null;
  for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
    const url = `${BASE}/${id}-${slug}?resultsPerPage=${POR_PAGINA}&page=${pagina}`;
    const json = await pedirJson(url);
    await dormir(PAUSA_MS);
    total = json.pagination.total_items ?? total;
    const lote = parsearMiniaturas($, json.rendered_products, id);
    productos.push(...lote);
    const paginas = json.pagination.pages_count ?? 1;
    if (lote.length === 0 || pagina >= paginas) break;
  }
  if (total !== null && productos.length !== total) {
    aviso(`categoría ${id}-${slug}: ${productos.length} leídos de ${total} anunciados`);
  }
  return { productos, total };
}

function informe(catalogo, CATEGORIAS) {
  console.log("\n================ INFORME DE ETIQUETADO ================");
  const cabecera = "categoría".padEnd(24) + "prod".padStart(6) + "modelos".padStart(9) + "sinTacón".padStart(10) + "sinColor".padStart(10);
  console.log(cabecera);
  for (const [idStr, slug] of Object.entries(CATEGORIAS)) {
    const id = Number(idStr);
    const ps = catalogo.filter((p) => p.categorias.includes(id));
    const modelos = new Set(ps.map((p) => p.modelo));
    const st = ps.filter((p) => p.tacon === null).length;
    const sc = ps.filter((p) => p.color === null).length;
    console.log(`${(id + "-" + slug).padEnd(24)}${String(ps.length).padStart(6)}${String(modelos.size).padStart(9)}${String(st).padStart(10)}${String(sc).padStart(10)}`);
  }
  const n = catalogo.length;
  const st = catalogo.filter((p) => p.tacon === null).length;
  const sc = catalogo.filter((p) => p.color === null).length;
  console.log(`TOTAL: ${n} productos, ${new Set(catalogo.map((p) => p.modelo)).size} modelos · sin tacón ${st} (${((st / n) * 100).toFixed(1)} %) · sin color ${sc} (${((sc / n) * 100).toFixed(1)} %)`);

  const agrupar = (lista) => {
    const m = new Map();
    for (const p of lista) {
      const k = p.modelo;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(p);
    }
    return m;
  };
  console.log("\n--- Modelos SIN TACÓN (revisar en content/etiquetas-manuales.ts) ---");
  for (const [modelo, ps] of agrupar(catalogo.filter((p) => p.tacon === null))) {
    console.log(`  [${ps[0].categorias.join(",")}] ${modelo}  ids=${ps.map((p) => p.id).join(",")}  «${ps[0].descripcion.slice(0, 110)}»`);
  }
  console.log("\n--- Productos SIN COLOR ---");
  for (const p of catalogo.filter((p) => p.color === null)) {
    console.log(`  [${p.categorias.join(",")}] ${p.id} ${p.nombre}`);
  }
  console.log("=======================================================\n");
}

async function principal() {
  const et = await cargarTs("lib/etiquetado.ts");
  const man = await cargarTs("content/etiquetas-manuales.ts");
  const manuales = man.etiquetasManuales ?? man.default ?? {};

  if (REETIQUETAR) {
    const actual = JSON.parse(await readFile(SALIDA, "utf8"));
    const reetiquetado = actual.map((p) => et.etiquetar(p, manuales));
    const tmp = `${SALIDA}.tmp`;
    await writeFile(tmp, JSON.stringify(reetiquetado, null, 2) + "\n", "utf8");
    await rename(tmp, SALIDA);
    log(`OK: ${reetiquetado.length} productos reetiquetados → content/catalogo.json`);
    if (INFORME) informe(reetiquetado, et.CATEGORIAS);
    return;
  }

  if (SOLO_INFORME) {
    const actual = JSON.parse(await readFile(SALIDA, "utf8"));
    // Reetiqueta con las reglas y manuales actuales (útil tras editar etiquetas-manuales.ts)
    const reetiquetado = actual.map((p) => et.etiquetar(p, manuales));
    informe(reetiquetado, et.CATEGORIAS);
    return;
  }

  const cheerio = await import("cheerio");
  const porId = new Map();
  const orden = [];
  for (const [idStr, slug] of Object.entries(et.CATEGORIAS)) {
    const id = Number(idStr);
    const { productos, total } = await descargarCategoria(cheerio, id, slug);
    log(`${id}-${slug}: ${productos.length} productos (anunciados ${total ?? "?"})`);
    for (const p of productos) {
      const previo = porId.get(p.id);
      if (previo) {
        if (!previo.categorias.includes(id)) previo.categorias.push(id);
      } else {
        porId.set(p.id, p);
        orden.push(p.id);
      }
    }
  }

  const caballero = orden.map((id) => porId.get(id)).filter((p) => et.esDeCaballero(p.nombre));
  if (caballero.length) log(`se excluyen ${caballero.length} productos de caballero (el asesor es para ella)`);

  const catalogo = orden
    .map((id) => porId.get(id))
    .filter((p) => !et.esDeCaballero(p.nombre))
    .map((p) => ({ ...p, categorias: [...p.categorias].sort((a, b) => a - b) }))
    .map((p) => et.etiquetar(p, manuales))
    .sort((a, b) => a.id - b.id);

  if (catalogo.length < MINIMO_PRODUCTOS) {
    throw new Error(`solo ${catalogo.length} productos (mínimo ${MINIMO_PRODUCTOS}): posible cambio en la web`);
  }

  const tmp = `${SALIDA}.tmp`;
  await writeFile(tmp, JSON.stringify(catalogo, null, 2) + "\n", "utf8");
  await rename(tmp, SALIDA);
  log(`OK: ${catalogo.length} productos únicos, ${new Set(catalogo.map((p) => p.modelo)).size} modelos → content/catalogo.json`);
  if (INFORME) informe(catalogo, et.CATEGORIAS);
}

principal().catch((e) => {
  console.error("\n[sync-catalogo] ERROR:", e?.message ?? e);
  if (existsSync(SALIDA)) {
    console.error("[sync-catalogo] Se CONSERVA el content/catalogo.json anterior (no se ha modificado).");
  } else {
    console.error("[sync-catalogo] No hay catalogo.json previo: el recomendador no tendrá productos.");
  }
  if (ESTRICTO) {
    console.error("[sync-catalogo] --estricto: salgo con código 1.");
    process.exit(1);
  }
  console.error("[sync-catalogo] Salgo con 0 para no romper el build (usa --estricto en CI).\n");
  process.exit(0);
});

