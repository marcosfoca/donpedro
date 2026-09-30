/**
 * Recomendador determinista (diseno.md §5.3). Sin IA ni aleatoriedad:
 * las mismas respuestas dan siempre el mismo resultado.
 *
 * 1) Candidatos: productos de las categorías de la celda ocasión × tiempo.
 * 2) Puntuación: tacón (+3 coincide · +1 null · −5 no coincide), color (+2 si su tono está entre
 *    los aceptados —discretos, llamativos o los elegidos en las muestras— o si es "todos" ·
 *    +0,5 null · −5 no coincide), estación (+1 si incluye la respuesta de Q2 · −5 si no: una
 *    sandalia nunca sale "en días de frío" sin avisar), +1 si está en la PRIMERA categoría de la
 *    fila (prioridad de la casa).
 * 3) Orden: puntuación desc → precio desc → id asc.
 * 4) Elegibles: puntuación ≥ 3. Si hay menos de 6 MODELOS distintos, se relaja, en este orden y
 *    de forma acumulativa: color → tacón adyacente → otra temporada → categorías de otras filas de
 *    la misma ocasión. Cada relajación se anuncia en R1 (lib/texto.ts → resumenRespuestas).
 *    Las relajaciones solo amplían quién es elegible; el ORDEN sigue usando la puntuación estricta,
 *    así lo que encaja de verdad con sus respuestas sale siempre primero.
 * 5) top: 6 modelos distintos · mas: siguientes del ranking, máx. 2 por modelo, hasta
 *    config.maxMasZapatos · urlTienda: categoría de la primera celda de la fila.
 */
import catalogoJson from "@/content/catalogo.json";
import { config } from "@/content/config";
import { TONOS, TONOS_DISCRETOS, urlCategoria } from "@/lib/etiquetado";
import type {
  Ocasion,
  Producto,
  Recomendar,
  Relajacion,
  Respuestas,
  ResultadoRecomendacion,
  Tacon,
  Tiempo,
  Tono,
} from "@/types";

// ---------- Tabla ocasión × tiempo (§5.3) ----------
export const TABLA: Record<Exclude<Ocasion, "casa">, Record<Tiempo, number[]>> = {
  diario: {
    frio: [22, 21, 16, 15], // botines, botas, mocasines, salones
    entretiempo: [16, 15, 40, 48], // mocasines, salones, bailarinas, merceditas
    calor: [19, 20, 40, 16], // sandalias, alpargatas, bailarinas, mocasines
  },
  celebracion: {
    frio: [18, 15, 22], // vestir, salones, botines
    entretiempo: [18, 15], // vestir, salones
    calor: [18, 19, 15], // vestir, sandalias, salones
  },
  caminar: {
    frio: [17, 51, 22, 16], // sport, deportivas, botines, mocasines
    entretiempo: [17, 51, 16], // sport, deportivas, mocasines
    calor: [17, 19, 20, 51], // sport, sandalias, alpargatas, deportivas
  },
};
/** Casa: zapatillas de casa (sin Q2 ni Q3). */
export const FILA_CASA = [23];

export const UMBRAL = 3;

/** Fila de categorías de la celda elegida. */
export function filaDe(r: Respuestas): number[] {
  return r.ocasion === "casa" ? FILA_CASA : TABLA[r.ocasion][r.tiempo];
}

/** Categorías de TODAS las filas de la misma ocasión (relajación 3), con la fila elegida delante. */
function categoriasDeLaOcasion(r: Respuestas): number[] {
  if (r.ocasion === "casa") return FILA_CASA;
  const out = [...TABLA[r.ocasion][r.tiempo]];
  for (const t of ["frio", "entretiempo", "calor"] as Tiempo[]) {
    for (const c of TABLA[r.ocasion][t]) if (!out.includes(c)) out.push(c);
  }
  return out;
}

const ADYACENTES: Record<Tacon, Tacon[]> = {
  plano: ["bajo"],
  bajo: ["plano", "tacon"],
  tacon: ["bajo"],
};

type Opciones = { ignorarColor: boolean; taconAdyacente: boolean; ignorarEstacion: boolean };
const ESTRICTO: Opciones = { ignorarColor: false, taconAdyacente: false, ignorarEstacion: false };

function puntosTacon(p: Producto, tacon: Tacon | null, o: Opciones): number {
  if (tacon === null) return 0; // casa: no se preguntó
  if (p.tacon === tacon) return 3;
  if (p.tacon === null) return 1;
  if (o.taconAdyacente && ADYACENTES[tacon].includes(p.tacon)) return 1;
  return -5;
}

/** Tonos que acepta la respuesta de Q4 (null = cualquiera). */
export function tonosAceptados(r: Pick<Respuestas, "color" | "tonos">): ReadonlySet<Tono> | null {
  if (r.color === "todos") return null;
  if (r.color === "concreto") return new Set(r.tonos);
  const discretos = new Set<Tono>(TONOS_DISCRETOS);
  if (r.color === "discretos") return discretos;
  return new Set((Object.keys(TONOS) as Tono[]).filter((t) => !discretos.has(t)));
}

function puntosColor(p: Producto, aceptados: ReadonlySet<Tono> | null, o: Opciones): number {
  if (aceptados === null || o.ignorarColor) return 2;
  if (p.color === null) return 0.5;
  if (aceptados.has(p.color)) return 2;
  // Un color que no coincide excluye (como el tacón): si no, Don Pedro diría "en negro"
  // y enseñaría un botín beige sin avisar. Solo entra tras la relajación "color", que se anuncia.
  return -5;
}

/** Puntuación §5.3 de un producto para unas respuestas y una fila. */
export function puntuar(p: Producto, r: Respuestas, fila: number[], o: Opciones = ESTRICTO): number {
  let s = puntosTacon(p, r.tacon, o) + puntosColor(p, tonosAceptados(r), o);
  if (r.tiempo !== null) {
    if (p.estaciones.includes(r.tiempo)) s += 1;
    else if (!o.ignorarEstacion) s -= 5;
  }
  if (p.categorias.includes(fila[0])) s += 1;
  return s;
}

/** Orden estable: puntuación desc → precio desc → id asc. */
function comparar(a: { p: Producto; s: number }, b: { p: Producto; s: number }): number {
  return b.s - a.s || b.p.precio - a.p.precio || a.p.id - b.p.id;
}

function modelosDistintos(ps: Producto[]): number {
  return new Set(ps.map((p) => p.modelo)).size;
}

/** Crea un recomendador sobre un catálogo concreto (la app usa el real; los tests pueden inyectar otro). */
export function crearRecomendador(
  catalogo: Producto[],
  cfg: { numRecomendaciones: number; maxMasZapatos: number } = config,
): Recomendar {
  return (r: Respuestas): ResultadoRecomendacion => {
    const fila = filaDe(r);
    const N = cfg.numRecomendaciones;

    // Pasos de relajación aplicables, en orden (§5.3). Se omiten los que no cambian nada.
    type Paso = { rel: Relajacion; o: Opciones; cats: number[] };
    const pasos: Paso[] = [];
    let o: Opciones = { ...ESTRICTO };
    let cats = fila;
    if (r.color !== "todos") {
      o = { ...o, ignorarColor: true };
      pasos.push({ rel: "color", o, cats });
    }
    if (r.tacon !== null) {
      o = { ...o, taconAdyacente: true };
      pasos.push({ rel: "tacon", o, cats });
    }
    if (r.tiempo !== null) {
      o = { ...o, ignorarEstacion: true };
      pasos.push({ rel: "estacion", o, cats });
    }
    const todasCats = categoriasDeLaOcasion(r);
    if (todasCats.length > fila.length) {
      cats = todasCats;
      pasos.push({ rel: "categorias", o, cats });
    }

    const elegibles = (op: Opciones, cs: number[]) =>
      catalogo.filter((p) => p.categorias.some((c) => cs.includes(c)) && puntuar(p, r, fila, op) >= UMBRAL);

    let lista = elegibles(ESTRICTO, fila);
    const relajaciones: Relajacion[] = [];
    for (const paso of pasos) {
      if (modelosDistintos(lista) >= N) break;
      relajaciones.push(paso.rel);
      lista = elegibles(paso.o, paso.cats);
    }
    // Red de seguridad (no debería ocurrir con el catálogo real; lo comprueban los tests):
    // todos los candidatos de la ocasión, sin umbral.
    if (modelosDistintos(lista) < N) {
      lista = catalogo.filter((p) => p.categorias.some((c) => todasCats.includes(c)));
      // Honestidad: si se llega aquí, cualquier filtro pudo saltarse; se anuncian todos.
      for (const rel of ["color", "tacon", "estacion", "categorias"] as Relajacion[]) {
        if (!relajaciones.includes(rel)) relajaciones.push(rel);
      }
    }

    // Orden con la puntuación ESTRICTA (lo que encaja de verdad, primero).
    const ranking = lista
      .map((p) => ({ p, s: puntuar(p, r, fila) }))
      .sort(comparar)
      .map((x) => x.p);

    const top: Producto[] = [];
    const vistos = new Set<string>();
    const usados = new Set<number>();
    for (const p of ranking) {
      if (top.length >= N) break;
      if (vistos.has(p.modelo)) continue;
      vistos.add(p.modelo);
      usados.add(p.id);
      top.push(p);
    }

    const mas: Producto[] = [];
    const porModelo = new Map<string, number>();
    for (const p of ranking) {
      if (mas.length >= cfg.maxMasZapatos) break;
      if (usados.has(p.id)) continue;
      const n = porModelo.get(p.modelo) ?? 0;
      if (n >= 2) continue;
      porModelo.set(p.modelo, n + 1);
      mas.push(p);
    }

    return { top, mas, relajaciones, urlTienda: urlCategoria(fila[0]) };
  };
}

export const catalogo: Producto[] = catalogoJson as Producto[];

export const recomendar: Recomendar = crearRecomendador(catalogo);

export default recomendar;
