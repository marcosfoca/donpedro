/**
 * Tipos compartidos de toda la experiencia. Solo cimientos modifica este archivo.
 */

// ---------- Respuestas del quiz (diseno.md §2) ----------
export type Ocasion = "diario" | "celebracion" | "caminar" | "casa";
export type Tiempo = "frio" | "entretiempo" | "calor";
export type Tacon = "plano" | "bajo" | "tacon";
/**
 * Preferencia de color en Q4: por carácter ("discretos", "llamativos"), "todos" (cualquiera) o
 * "concreto", que abre las muestras para elegir uno o varios tonos (`tonos`).
 */
export type ColorPreferido = "discretos" | "llamativos" | "todos" | "concreto";
/**
 * Tono concreto de un zapato, deducido del nombre (lib/etiquetado.ts → TONOS). "otro" agrupa los
 * que no tienen muestra propia (amarillo, naranja, estampados, bicolor…): solo cuentan como llamativos.
 */
export type Tono =
  | "negro"
  | "marron"
  | "beige"
  | "blanco"
  | "gris"
  | "marino"
  | "burdeos"
  | "azul"
  | "rojo"
  | "rosa"
  | "verde"
  | "metal"
  | "otro";

/**
 * Respuestas COMPLETAS, las que recibe el recomendador.
 * Si ocasion === "casa", tiempo y tacon son null (se saltan Q2 y Q3).
 */
export type Respuestas = (
  | { ocasion: Exclude<Ocasion, "casa">; tiempo: Tiempo; tacon: Tacon }
  | { ocasion: "casa"; tiempo: null; tacon: null }
) & {
  color: ColorPreferido;
  /** Solo con color "concreto", y entonces con al menos un tono (lo garantiza completarRespuestas). */
  tonos?: Tono[];
};

/** Respuestas en curso (lo que guarda el estado mientras se responde). */
export type RespuestasParciales = {
  ocasion?: Ocasion;
  tiempo?: Tiempo;
  tacon?: Tacon;
  color?: ColorPreferido;
  /** Tonos elegidos en las muestras (solo con color "concreto"). */
  tonos?: Tono[];
};

// ---------- Fases de la máquina de estados ----------
export type FasePregunta = "q1" | "q2" | "q3" | "q4";
export type Fase =
  | "fachada"
  | "entrada"
  | "saludo"
  | FasePregunta
  | "trastienda"
  | "resultados";

/** Valor admitido por cada pregunta. */
export type ValorPregunta = {
  q1: Ocasion;
  q2: Tiempo;
  q3: Tacon;
  q4: ColorPreferido;
};

// ---------- Catálogo (diseno.md §5.3, literal) ----------
export type Producto = {
  id: number; idAtributo: number; nombre: string; modelo: string;
  url: string; imagen: string; precio: number; precioAnterior?: number;
  descripcion: string; categorias: number[];
  tacon: "plano" | "bajo" | "tacon" | null;
  /** Tono principal (el primero que nombra el nombre) o null si el nombre no lo dice. */
  color: Tono | null;
  estaciones: ("frio" | "entretiempo" | "calor")[];
};

/**
 * Relajaciones aplicadas por el recomendador (§5.3), en el orden en que se aplican.
 * - "color": se ignoró el color
 * - "tacon": se permitió un tacón adyacente
 * - "estacion": se admitieron productos de otra temporada dentro de la misma fila
 * - "categorias": se añadieron categorías de otras filas de la misma ocasión
 */
export type Relajacion = "color" | "tacon" | "estacion" | "categorias";

export type ResultadoRecomendacion = {
  /** Exactamente config.numRecomendaciones (6) modelos distintos. */
  top: Producto[];
  /** Siguientes del mismo ranking (máx. 2 por modelo), para "Más zapatos para usted". */
  mas: Producto[];
  relajaciones: Relajacion[];
  /** URL de "Ver toda la tienda" (categoría de la primera celda de la fila elegida). */
  urlTienda: string;
};

/** Firma pactada entre M2 (lib/recomendador.ts) y M5. */
export type Recomendar = (r: Respuestas) => ResultadoRecomendacion;
