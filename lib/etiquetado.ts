/**
 * Etiquetado automático del catálogo (diseno.md §5.2–§5.3).
 *
 * IMPORTANTE: este módulo es AUTOCONTENIDO (solo `import type`). Lo usan:
 *  - la app y los tests (TypeScript normal), y
 *  - scripts/sync-catalogo.mjs, que lo transpila en memoria con `typescript`
 *    (Node 18 no importa .ts) y lo carga como módulo ESM.
 * No añadas imports de valores (ni "@/..."): rompería la carga desde el script.
 */
import type { Producto, Tono } from "../types";

// ---------- Categorías ----------
export const CAT = {
  salones: 15,
  mocasines: 16,
  sport: 17,
  vestir: 18,
  sandalias: 19,
  alpargatas: 20,
  botas: 21,
  botines: 22,
  casa: 23,
  bailarinas: 40,
  merceditas: 48,
  deportivas: 51,
} as const;

/** id → slug de la URL de categoría en PrestaShop. */
export const CATEGORIAS: Record<number, string> = {
  15: "salones",
  16: "mocasines",
  17: "sport",
  18: "vestir",
  19: "sandalias",
  20: "alpargatas",
  21: "botas",
  22: "botines",
  23: "zapatillas-de-casa",
  40: "bailarinas",
  48: "merceditas",
  51: "zapatillas-deportivas",
};

export const URL_TIENDA = "https://donpedrohabana.com";

export function urlCategoria(id: number): string {
  return `${URL_TIENDA}/${id}-${CATEGORIAS[id]}`;
}

// ---------- Tipos ----------
export type Estacion = Producto["estaciones"][number];
export type Etiquetas = Pick<Producto, "tacon" | "color" | "estaciones" | "modelo">;
/** Correcciones manuales: `{ [id_product]: Partial<Etiquetas> }` (tienen prioridad). */
export type EtiquetasManuales = Record<number, Partial<Etiquetas>>;

/** Lo que extrae el sincronizador de cada miniatura, antes de etiquetar. */
export type ProductoBruto = Omit<Producto, "modelo" | "tacon" | "color" | "estaciones">;

// ---------- Normalización ----------
/** Mayúsculas, sin tildes ni diéresis (Ñ → N), espacios simples. "Salón cuña" → "SALON CUNA". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/** true si `frase` (ya normalizada) aparece como palabras completas en `texto` normalizado. */
export function contiene(textoNorm: string, frase: string): boolean {
  return ` ${textoNorm} `.includes(` ${frase} `);
}

// ---------- Tacón ----------
const CATS_PLANO: number[] = [
  CAT.bailarinas,
  CAT.sport,
  CAT.deportivas,
  CAT.merceditas,
  CAT.alpargatas, // salvo "CUÑA"
  CAT.casa,
  CAT.mocasines,
];

const PAL_BAJO = [
  "CUNA",
  "CUNAS",
  "TACON BAJO",
  "POCO TACON",
  "NO QUIEREN IR CON MUCHO TACON",
  "TACON BAJITO",
  "TACONCITO",
  "TACON MEDIO",
  "MEDIO TACON",
];
const PAL_PLANO = ["SIN TACON", "PLANO", "PLANA", "PLANOS", "PLANAS"];
const PAL_TACON = ["TACON", "TACONES", "TACON ALTO", "ESTILETO", "STILETTO"];

function taconPorPalabras(textoNorm: string): Producto["tacon"] {
  if (PAL_BAJO.some((p) => contiene(textoNorm, p))) return "bajo";
  if (PAL_PLANO.some((p) => contiene(textoNorm, p))) return "plano";
  if (PAL_TACON.some((p) => contiene(textoNorm, p))) return "tacon";
  return null;
}

/**
 * 1) Categoría plana (bailarinas, sport, deportivas, merceditas, casa, mocasines;
 *    alpargatas salvo "CUÑA") → plano.
 *    Excepción (revisión del catálogo real): si el NOMBRE dice tacón o cuña fuera de
 *    zapatillas de casa ("BAILARINA CON TACÓN MEDIO", "MOCASÍN CON ANTIFAZ Y TACÓN")
 *    → bajo: es un modelo de familia plana con algo de tacón.
 * 2) Palabras clave: primero en el NOMBRE y, si no hay, en la DESCRIPCIÓN.
 *    CUÑA / TACÓN BAJO / TACÓN MEDIO / POCO TACÓN… → bajo · SIN TACÓN / PLANO/A → plano ·
 *    TACÓN / ESTILETO → tacon.
 * 3) Sin nada → null (se corrige en content/etiquetas-manuales.ts).
 */
export function etiquetarTacon(nombre: string, descripcion: string, categorias: number[]): Producto["tacon"] {
  const n = normalizar(nombre);
  const d = normalizar(descripcion);
  const tieneCuna = contiene(n, "CUNA") || contiene(d, "CUNA");
  const planaPorCategoria = categorias.some(
    (c) => CATS_PLANO.includes(c) && !(c === CAT.alpargatas && tieneCuna),
  );
  if (planaPorCategoria) {
    const porNombre = taconPorPalabras(n);
    const esCasa = categorias.includes(CAT.casa);
    if (!esCasa && (porNombre === "bajo" || porNombre === "tacon")) return "bajo";
    return "plano";
  }
  return taconPorPalabras(n) ?? taconPorPalabras(d);
}

// ---------- Color ----------
/**
 * Palabras de color del catálogo real → tono concreto (las muestras de Q4). Revisadas con
 * `node scripts/sync-catalogo.mjs --informe`. Los nombres de color propios de la tienda
 * (TRIANA, PLAYA, SIBERIA, SAKARA) se comprobaron con la foto del producto.
 */
export const TONOS: Record<Tono, string[]> = {
  negro: ["NEGRO", "NEGRA", "BLACK", "CARBON"],
  marron: [
    "MARRON", "MARRON OSCURO", "CUERO", "CHOCOLATE", "TABACO", "COGNAC", "CONAC", "BRANDY", "WHISKY",
    "CAFE", "MORO", "MOKA", "MOCA", "CASTANO", "BROWN", "CAMEL", "TOSTADO", "MIEL", "TIERRA", "OCRE",
    "TURRON",
  ],
  beige: [
    "BEIGE", "BEIG", "CREMA", "TAUPE", "TOPO", "NUDE", "PIEDRA", "ARENA", "MAQUILLAJE", "CARNE", "CAVA",
    "CHAMPAN", "CHAMPAGNE", "VAINILLA", "LINO", "SAND", "VISON", "AVENA", "SAHARA", "NATURAL", "CRUDO",
    "CRUDA", "CUARZO", "TRIANA", "PLAYA", "SIBERIA", "SAKARA",
  ],
  blanco: ["BLANCO", "BLANCA", "WHITE", "OFF WHITE", "BLANCO ROTO", "HIELO", "PERLA", "MARFIL", "HUESO"],
  gris: ["GRIS", "GRIS OSCURO", "GRIS CLARO", "ANTRACITA", "PLOMO"],
  marino: ["MARINO", "AZUL MARINO", "NAVY", "MARINA"],
  burdeos: ["BURDEOS", "GRANATE", "VINO", "CEREZA", "CHERRY", "GUINDA"],
  azul: [
    "AZUL", "CELESTE", "TURQUESA", "BLUE", "JEANS", "VAQUERO", "INDIGO", "ELECTRICO", "KLEIN",
    "MULTIAZUL", "AGUAMARINA", "PETROLEO",
  ],
  rojo: ["ROJO", "ROJA", "RED", "CALDERA", "TEJA", "FRAMBUESA"],
  rosa: [
    "ROSA", "ROSE", "PINK", "FUCSIA", "MAGENTA", "CORAL", "SALMON", "MALVA", "LILA", "LAVANDA", "MORADO",
    "PURPURA", "BERENJENA", "CIRUELA", "BUGANVILLA", "ALBARICOQUE",
  ],
  verde: ["VERDE", "KAKI", "CAQUI", "OLIVA", "BOTELLA", "MENTA", "PISTACHO"],
  metal: [
    "ORO", "PLATA", "PLAT", "DORADO", "DORADA", "PLATEADO", "PLATEADA", "METALIZADO", "METALIZADA",
    "BRONCE", "COBRE", "PLATINO", "PEWTER", "GOLD", "SILVER",
  ],
  otro: [
    "AMARILLO", "NARANJA", "MOSTAZA", "MULTIMOSTAZA", "ESTAMPADO", "ESTAMPADA", "LEOPARDO", "SERPIENTE",
    "ANIMAL PRINT", "CEBRA", "PITON", "COCODRILO", "FLORES", "MULTICOLOR", "BICOLOR", "TRICOLOR",
    "COMBINADO", "COMBINADA",
  ],
};

/**
 * Tonos que cuentan como "discretos" en Q4; el resto (azul, rojo, rosa, verde, metalizados y
 * "otro") son "llamativos". El burdeos se considera discreto: es el tono sobrio de la casa.
 */
export const TONOS_DISCRETOS: readonly Tono[] = ["negro", "marron", "beige", "blanco", "gris", "marino", "burdeos"];

// Mapa frase normalizada → tono, y longitud máxima en palabras (para frases como "AZUL MARINO").
const COLOR_DE: Map<string, Tono> = new Map();
for (const tono of Object.keys(TONOS) as Tono[]) {
  for (const frase of TONOS[tono]) COLOR_DE.set(normalizar(frase), tono);
}
const MAX_PALABRAS_COLOR = Math.max(...[...COLOR_DE.keys()].map((k) => k.split(" ").length));

/** Palabras que matizan un color y forman parte de él al quitarlo del modelo ("PLATA VIEJA"). */
const MATICES = new Set(["OSCURO", "OSCURA", "CLARO", "CLARA", "VIEJO", "VIEJA", "METALIZADO", "METALIZADA", "MATE", "PASTEL", "FLUOR"]);

type ColorEncontrado = { tono: Tono; inicio: number; fin: number };

/**
 * Busca la ÚLTIMA palabra (o frase) de color del nombre, recorriendo de derecha a izquierda
 * y prefiriendo la frase más larga ("AZUL MARINO" antes que "MARINO").
 */
export function buscarColor(nombre: string): ColorEncontrado | null {
  const t = normalizar(nombre).split(" ").filter(Boolean);
  for (let fin = t.length; fin > 0; fin--) {
    for (let largo = Math.min(MAX_PALABRAS_COLOR, fin); largo >= 1; largo--) {
      const inicio = fin - largo;
      const tono = COLOR_DE.get(t.slice(inicio, fin).join(" "));
      if (tono) return { tono, inicio, fin };
    }
  }
  return null;
}

/**
 * Tono PRINCIPAL: el primero que aparece en el nombre. En combinaciones como
 * "BICOLOR MARINO-BEIGE" o "NEGRO/ORO" el color dominante se nombra primero; si se usara el
 * último, Don Pedro enseñaría un salón marino como beige.
 */
const COLORES_GENERICOS = new Set(["BICOLOR", "TRICOLOR", "MULTICOLOR", "COMBINADO", "COMBINADA"]);

export function etiquetarColor(nombre: string): Producto["color"] {
  const t = normalizar(nombre).split(" ").filter(Boolean);
  let generico: Producto["color"] = null;
  for (let inicio = 0; inicio < t.length; inicio++) {
    for (let largo = Math.min(MAX_PALABRAS_COLOR, t.length - inicio); largo >= 1; largo--) {
      const frase = t.slice(inicio, inicio + largo).join(" ");
      const tono = COLOR_DE.get(frase);
      if (!tono) continue;
      // "BICOLOR" solo decide si no se nombra ningún color concreto ("BICOLOR MARINO-BEIGE" → marino).
      if (COLORES_GENERICOS.has(frase)) {
        generico ??= tono;
        break;
      }
      return tono;
    }
  }
  return generico;
}

// ---------- Estaciones ----------
const TODO_EL_ANO: Estacion[] = ["frio", "entretiempo", "calor"];
const ESTACIONES_CAT: Record<number, Estacion[]> = {
  [CAT.botas]: ["frio"],
  [CAT.botines]: ["frio"],
  [CAT.sandalias]: ["calor"],
  [CAT.alpargatas]: ["calor"],
  [CAT.bailarinas]: ["entretiempo", "calor"],
  [CAT.merceditas]: ["entretiempo", "calor"],
  [CAT.salones]: TODO_EL_ANO,
  [CAT.mocasines]: TODO_EL_ANO,
  [CAT.sport]: TODO_EL_ANO,
  [CAT.vestir]: TODO_EL_ANO,
  [CAT.deportivas]: TODO_EL_ANO,
  [CAT.casa]: TODO_EL_ANO,
};

const PAL_FRIO = ["FORRO", "FORRADO", "FORRADA", "LANA", "BORREGO", "ANTE"];
/**
 * El TIPO de zapato manda sobre la categoría (auditoría de persuasión, C1): "vestir" y "salones"
 * son de todo el año, pero una sandalia de fiesta no es para el frío ni un botín para el calor.
 */
const PAL_ABIERTO = ["SANDALIA", "SANDALIAS", "ALPARGATA", "ALPARGATAS", "CHANCLA", "CHANCLAS", "PEEP"];
const PAL_CANA = ["BOTA", "BOTAS", "BOTIN", "BOTINES"];
/** "SIN FORRO" / "SIN FORRAR" indican lo contrario: no añaden frío. */
const PAL_NO_FRIO = ["SIN FORRO", "SIN FORRAR"];

/**
 * Por categoría. Si el producto está en varias, se toma la INTERSECCIÓN (la categoría más
 * específica manda: un botín que también está en "vestir" sigue siendo de frío); si la
 * intersección queda vacía, la unión. "FORRO/LANA/BORREGO/ANTE" añaden frío.
 * Orden fijo: frio, entretiempo, calor.
 */
export function etiquetarEstaciones(nombre: string, descripcion: string, categorias: number[]): Estacion[] {
  const listas = categorias.map((c) => ESTACIONES_CAT[c]).filter(Boolean);
  let set: Set<Estacion>;
  if (listas.length === 0) set = new Set(TODO_EL_ANO);
  else {
    const inter = TODO_EL_ANO.filter((e) => listas.every((l) => l.includes(e)));
    set = new Set(inter.length ? inter : TODO_EL_ANO.filter((e) => listas.some((l) => l.includes(e))));
  }
  const n = normalizar(nombre);
  // Zapato abierto: nunca de frío. De vestir (fiesta) vale también para el entretiempo.
  if (PAL_ABIERTO.some((p) => contiene(n, p))) {
    return categorias.includes(CAT.vestir) ? ["entretiempo", "calor"] : ["calor"];
  }
  // Bota o botín: de frío (el botín también sirve en entretiempo), nunca de calor.
  if (PAL_CANA.some((p) => contiene(n, p))) {
    return contiene(n, "BOTIN") || contiene(n, "BOTINES") ? ["frio", "entretiempo"] : ["frio"];
  }
  let texto = `${n} ${normalizar(descripcion)}`;
  for (const p of PAL_NO_FRIO) texto = ` ${texto} `.split(` ${p} `).join(" ");
  if (PAL_FRIO.some((p) => contiene(texto.trim(), p))) set.add("frio");
  return TODO_EL_ANO.filter((e) => set.has(e));
}

// ---------- Modelo ----------
const RELLENO = new Set(["DE", "EN", "Y", "CON"]);

/** Índices de palabras que forman frases de color (y sus matices: "PLATA VIEJA", "GRIS OSCURO"). */
function indicesDeColor(t: string[]): Set<number> {
  const quitar = new Set<number>();
  let i = 0;
  while (i < t.length) {
    let largo = 0;
    for (let l = Math.min(MAX_PALABRAS_COLOR, t.length - i); l >= 1; l--) {
      if (COLOR_DE.has(t.slice(i, i + l).join(" "))) {
        largo = l;
        break;
      }
    }
    if (largo === 0) {
      i++;
      continue;
    }
    let ini = i;
    let fin = i + largo;
    while (fin < t.length && MATICES.has(t[fin])) fin++;
    while (ini > 0 && MATICES.has(t[ini - 1])) ini--;
    for (let k = ini; k < fin; k++) quitar.add(k);
    i = fin;
  }
  return quitar;
}

/**
 * Clave de modelo (§5.2): nombre normalizado SIN las palabras de color (con sus matices) y
 * sin palabras de relleno (DE, EN, Y, CON). Se quitan TODAS las de color, no solo la final,
 * porque el catálogo real mezcla "SALÓN DESTALONADO BICOLOR" y "SALÓN DESTALONADO BICOLOR
 * BEIGE", o "SALÓN BEIGE LAZO", y deben contar como el mismo modelo.
 * Ej.: "SALÓN DE TACÓN EN PIEL NEGRO" y "SALÓN DE TACÓN PIEL VERDE" → "SALON TACON PIEL".
 */
export function calcularModelo(nombre: string): string {
  // Colapsa palabras repetidas seguidas (erratas del catálogo: "TACON ALTO ALTO", "TIRAS TIRAS").
  const t = normalizar(nombre)
    .split(" ")
    .filter(Boolean)
    .filter((w, i, a) => w !== a[i - 1]);
  const quitar = indicesDeColor(t);
  const resto = t.filter((w, i) => !quitar.has(i) && !RELLENO.has(w));
  return resto.join(" ") || normalizar(nombre);
}

// ---------- Exclusiones ----------
/**
 * Productos de caballero: la tienda los tiene en las categorías de mujer (zapatillas de casa,
 * alpargatas), pero el asesor es para ella. El sincronizador no los guarda en catalogo.json.
 */
export function esDeCaballero(nombre: string): boolean {
  const n = normalizar(nombre);
  return contiene(n, "CABALLERO") || contiene(n, "HOMBRE");
}

// ---------- Todo junto ----------
export function etiquetar(p: ProductoBruto, manuales: EtiquetasManuales = {}): Producto {
  const auto: Etiquetas = {
    modelo: calcularModelo(p.nombre),
    tacon: etiquetarTacon(p.nombre, p.descripcion, p.categorias),
    color: etiquetarColor(p.nombre),
    estaciones: etiquetarEstaciones(p.nombre, p.descripcion, p.categorias),
  };
  return aplicarManuales({ ...p, ...auto }, manuales);
}

/** Las etiquetas manuales tienen prioridad sobre las automáticas (solo los campos presentes). */
export function aplicarManuales(p: Producto, manuales: EtiquetasManuales): Producto {
  const m = manuales[p.id];
  if (!m) return p;
  const out: Producto = { ...p };
  if (m.modelo !== undefined) out.modelo = m.modelo;
  if (m.tacon !== undefined) out.tacon = m.tacon;
  if (m.color !== undefined) out.color = m.color;
  if (m.estaciones !== undefined) out.estaciones = TODO_EL_ANO.filter((e) => m.estaciones!.includes(e));
  return out;
}
