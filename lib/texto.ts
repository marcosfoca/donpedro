import { textos } from "@/content/textos";
import type { Producto, Relajacion, Respuestas } from "@/types";

/**
 * Palabras que el catálogo puede traer SIN tilde en mayúsculas y que en tipo oración
 * deben llevarla. Si el catálogo ya trae la tilde (SALÓN), se respeta tal cual.
 */
const TILDES: Record<string, string> = {
  salon: "salón",
  tacon: "tacón",
  marron: "marrón",
  algodon: "algodón",
  cordon: "cordón",
  nautico: "náutico",
  nauticos: "náuticos",
  nautica: "náutica",
  anatomica: "anatómica",
  anatomico: "anatómico",
  plastico: "plástico",
  elastico: "elástico",
  elastica: "elástica",
  clasico: "clásico",
  clasica: "clásica",
  metalico: "metálico",
  metalica: "metálica",
  botin: "botín",
  mocasin: "mocasín",
  elasticos: "elásticos",
  elasticas: "elásticas",
  turron: "turrón",
  gales: "galés",
  cafe: "café",
  vison: "visón",
  ingles: "inglés",
  inspiracion: "inspiración",
  talon: "talón",
  petroleo: "petróleo",
  paris: "París",
};

/** Nombres propios de modelo que el catálogo trae en mayúsculas (auditoría de voz). */
const NOMBRES_PROPIOS: Record<string, string> = {
  elena: "Elena",
  bonny: "Bonny",
  passy: "Passy",
  leyna: "Leyna",
  malori: "Malori",
  triana: "Triana",
  padme: "Padme",
  h: "H",
};

/**
 * Erratas del catálogo de PrestaShop (parche mientras se corrigen en la tienda: también salen
 * en sus fichas). Se aplican sobre el texto ya en minúsculas.
 */
const CORRECCIONES: [RegExp, string][] = [
  [/\bchaol\b/g, "charol"],
  [/\belastivos\b/g, "elásticos"],
  [/\bplat$/g, "plata"],
  [/\bbeig\b/g, "beige"],
  [/(^|\s)(\p{L}+) \2(?=\s|$)/gu, "$1$2"], // palabra repetida: "alto alto", "tiras tiras"
  [/- /g, "-"], // "Sandalia- alpargata"
];

/**
 * "SALÓN CUÑA PIEL NEGRO" -> "Salón cuña piel negro".
 * Minúsculas con locale es-ES (conserva Ó, Ñ, Ü), repone tildes habituales que falten
 * y pone mayúscula inicial.
 */
export function tipoOracion(texto: string): string {
  const limpio = texto.trim().replace(/\s+/g, " ");
  if (!limpio) return "";
  let minus = limpio.toLocaleLowerCase("es-ES");
  for (const [patron, sustituto] of CORRECCIONES) minus = minus.replace(patron, sustituto);
  minus = minus.replace(/[a-zñáéíóúü]+/g, (palabra) => NOMBRES_PROPIOS[palabra] ?? TILDES[palabra] ?? palabra);
  return minus.charAt(0).toLocaleUpperCase("es-ES") + minus.slice(1);
}

/** Noche = de 21 a 6 h, el mismo corte que "Buenas noches" (fachada nocturna). */
export function esDeNoche(fecha: Date = new Date()): boolean {
  const h = fecha.getHours();
  return h >= 21 || h < 6;
}

/** Saludo por hora local: 6–14 días (en Madrid, hasta comer), 14–21 tardes, 21–6 noches. */
export function saludoPorHora(fecha: Date = new Date()): string {
  const h = fecha.getHours();
  const t = textos.saludo.porHora;
  if (h >= 6 && h < 14) return t.dias;
  if (h >= 14 && h < 21) return t.tardes;
  return t.noches;
}

/**
 * 98 -> "98,00 €" · 1234.5 -> "1.234,50 €".
 * El espacio antes de € es NO separable ( ) para que el símbolo no salte de línea.
 */
export function formatoPrecio(precio: number): string {
  const [entero, decimales] = Math.abs(precio).toFixed(2).split(".");
  const conMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${precio < 0 ? "-" : ""}${conMiles},${decimales} €`;
}

/**
 * R1: frase de Don Pedro que resume las respuestas reales. Si el recomendador relajó filtros,
 * lo dice dentro de la misma frase, con lo que tienen de distinto los añadidos:
 * "…yo le pondría estos (y alguno de otro color o con menos tacón):".
 * La relajación de color con respuesta "todos" no se menciona (no había filtro que relajar).
 */
export function resumenRespuestas(r: Respuestas, relajaciones: Relajacion[] = []): string {
  const R = textos.resultados;
  const f = R.fragmentos;
  const d = R.diferencias;
  const difs: string[] = [];
  if (relajaciones.includes("color") && r.color !== "todos") difs.push(d.color);
  if (relajaciones.includes("tacon") && r.tacon) difs.push(d.tacon[r.tacon]);
  // Ampliar categorías sin salirse de la temporada no contradice nada de lo dicho; en el orden
  // general, "categorias" solo llega después de "estacion", que ya lo anuncia.
  if (relajaciones.includes("estacion")) difs.push(d.temporada);
  const color = fraseColor(r);
  if (r.ocasion === "casa") {
    const extra = difs.length ? R.relajacionCasa(difs.join(d.conector)) : "";
    return R.plantillaCasa(color, extra);
  }
  const extra = difs.length ? R.relajacion(difs.join(d.conector)) : "";
  return R.plantilla(f.ocasion[r.ocasion], f.tiempo[r.tiempo], f.tacon[r.tacon], color, extra);
}

/** "en colores discretos" · "en negro" · "en negro o marrón" · "en negro, gris o burdeos". */
export function fraseColor(r: Pick<Respuestas, "color" | "tonos">): string {
  const f = textos.resultados.fragmentos;
  if (r.color !== "concreto") return f.color[r.color];
  const tonos = r.tonos ?? [];
  if (tonos.length === 0 || tonos.length > 3) return f.variosTonos;
  const nombres = tonos.map((t) => f.tono[t]);
  const ultimo = nombres.pop() as string;
  return `en ${nombres.length ? `${nombres.join(", ")} o ${ultimo}` : ultimo}`;
}

/**
 * Etiqueta corta de la tarjeta en móvil (decisión del usuario, 2026-09-29): tipo de zapato y
 * tacón, sacados de datos reales. "Salón · tacón bajo", "Botín · plano". Sin tacón conocido, solo
 * el tipo.
 */
export function etiquetaCorta(p: Pick<Producto, "nombre" | "categorias" | "tacon">): string {
  const R = textos.resultados;
  const primera = p.nombre
    .trim()
    .split(/\s+/)[0]
    ?.toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const tipo =
    (primera && R.tipoPorPalabra[primera]) ||
    p.categorias.map((c) => R.tipoPorCategoria[c]).find(Boolean) ||
    "";
  const tacon = p.tacon ? R.etiquetaTacon[p.tacon] : "";
  return [tipo, tacon].filter(Boolean).join(" · ");
}
