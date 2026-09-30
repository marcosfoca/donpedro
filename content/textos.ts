/**
 * Todos los textos literales de la experiencia (diseno.md §2), incluidos aria-label, etiquetas de
 * sección, errores y estados vacíos. Editables sin tocar componentes.
 * Voz: Don Pedro trata de usted; botones en infinitivo o neutro. Excepciones escritas: "Empezamos"
 * y las opciones del quiz hablan con la voz de la clienta (que también le trata de usted).
 * Longitud (auditoría de voz): reacciones ≤ 40 caracteres; burbujas a ancho completo ≤ 2 líneas.
 */
import type { ColorPreferido, Ocasion, Tacon, Tiempo, Tono } from "@/types";

export type OpcionTexto<Id extends string> = {
  id: Id;
  texto: string;
  subtexto?: string;
};

export type PreguntaTexto<Id extends string> = {
  pregunta: string;
  opciones: OpcionTexto<Id>[];
  reacciones: Record<Id, string>;
};

// ---------- F — Fachada ----------
const fachada = {
  titulo: "Don Pedro le atiende",
  subtitulo: "Cuatro preguntas y le saco los zapatos que yo le pondría.",
  cta: "Abrir la puerta",
  direccion: "Paseo de la Habana, 50 · Madrid · Desde 1958",
  altFachada: "Fachada de la Zapatería Don Pedro, Paseo de la Habana, 50",
  etiquetaPuerta: "Abrir la puerta de la tienda",
};

// ---------- T — Entrada ----------
const entrada = {
  saltar: "Saltar",
  etiquetaSaltar: "Saltar la entrada",
  etiqueta: "Entrando en la tienda",
};

// ---------- Sonido ----------
const sonido = {
  etiqueta: "Sonido",
};

// ---------- S — Saludo ----------
const saludo = {
  /** Saludo por hora (lib/texto.ts → saludoPorHora). En Madrid, "buenos días" hasta comer. */
  porHora: { dias: "Buenos días", tardes: "Buenas tardes", noches: "Buenas noches" },
  burbujas: (saludoHora: string): string[] => [
    `¡${saludoHora}! Pase, pase. Comprar sin probarse da respeto, ya lo sé.`,
    "Soy Pedro: abrí esta casa y su taller en 1958. Hoy la llevan mis nietas, Magüi y Kiska.",
    "Dígame cuatro cosas y le saco lo que yo le pondría.",
  ],
  cta: "Empezamos",
  saltar: "Saltar",
  etiquetaSaltar: "Saltar el saludo",
  etiqueta: "El saludo de Don Pedro",
};

// ---------- Q — Preguntas ----------
const q1: PreguntaTexto<Ocasion> = {
  pregunta: "Lo primero: ¿para qué los quiere?",
  opciones: [
    { id: "diario", texto: "Para el día a día" },
    { id: "celebracion", texto: "Para una boda o una celebración" },
    { id: "caminar", texto: "Para caminar mucho" },
    { id: "casa", texto: "Para estar en casa" },
  ],
  reacciones: {
    diario: "Los de todos los días no pueden fallar.",
    celebracion: "¡Qué alegría! Ahí se está mucho de pie.",
    caminar: "Primero el pie; lo bonito viene luego.",
    casa: "A gusto en casa. Solo me falta una cosa.",
  },
};

const q2: PreguntaTexto<Tiempo> = {
  pregunta: "¿Y para qué tiempo?",
  opciones: [
    { id: "frio", texto: "Para el frío" },
    { id: "entretiempo", texto: "Para el entretiempo" },
    { id: "calor", texto: "Para el calor" },
  ],
  reacciones: {
    frio: "Pie calentito y bien sujeto. Apuntado.",
    entretiempo: "Lo más difícil en Madrid. Apuntado.",
    calor: "Pie fresco, que agosto no perdona.",
  },
};

const q3: PreguntaTexto<Tacon> = {
  pregunta: "Dígame la verdad: ¿qué tal con el tacón?",
  opciones: [
    { id: "plano", texto: "Plano, por favor", subtexto: "Sin tacón" },
    { id: "bajo", texto: "Un poquito", subtexto: "Cuña o tacón bajo" },
    { id: "tacon", texto: "Con tacón", subtexto: "Me gusta ir más alta" },
  ],
  reacciones: {
    plano: "Plano no quiere decir sin gracia.",
    bajo: "Lo que más me piden: altura sin sufrir.",
    tacon: "Tacón, sí; pero sin sufrir.",
  },
};

const q4: PreguntaTexto<ColorPreferido> = {
  pregunta: "Y por último: ¿qué colores le gustan?",
  opciones: [
    { id: "discretos", texto: "Discretos", subtexto: "Negro, marrón, beige…" },
    { id: "llamativos", texto: "Llamativos", subtexto: "Rojo, verde, dorado…" },
    { id: "todos", texto: "Cualquiera", subtexto: "Usted manda" },
    { id: "concreto", texto: "Uno en concreto", subtexto: "Se lo digo yo" },
  ],
  reacciones: {
    discretos: "Discretos: combinan con todo.",
    llamativos: "¡Eso me gusta! El color alegra la calle.",
    todos: "Elijo yo. No la voy a defraudar.",
    concreto: "Buen ojo. Apuntado.",
  },
};

/** Q4 → "Uno en concreto": muestras de color (se puede marcar más de una). */
const colores = {
  pregunta: "¿Cuál? Si quiere, marque varios.",
  etiquetaGrupo: "Colores",
  seguir: "Seguir",
  /** Nombre de cada muestra (el tono "otro" no tiene muestra). */
  tonos: {
    negro: "Negro",
    marron: "Marrón",
    beige: "Beige",
    blanco: "Blanco",
    gris: "Gris",
    marino: "Azul marino",
    burdeos: "Burdeos",
    azul: "Azul",
    rojo: "Rojo",
    rosa: "Rosa",
    verde: "Verde",
    metal: "Oro y plata",
  } satisfies Record<Exclude<Tono, "otro">, string>,
};

const quiz = {
  atras: "Atrás",
  /** Texto visible de la barra de progreso. */
  progreso: (paso: number, total: number) => `${paso} de ${total}`,
  /** Texto anunciado por lectores de pantalla. */
  progresoAccesible: (paso: number, total: number) => `Pregunta ${paso} de ${total}`,
  /** Pista para adelantar la reacción de Don Pedro. */
  tocarParaSeguir: "Toque para seguir",
};

// ---------- E — Trastienda ----------
const trastienda = {
  burbujas: ["Deme un momentito, que voy a la trastienda…", "…a por los que no se quedan en el armario."],
  saltar: "Saltar",
  etiquetaSaltar: "Saltar la espera",
  /** Tras decir lo que ha sacado, Don Pedro enseña la selección. */
  verZapatos: "Ver los zapatos",
  etiqueta: "Don Pedro va a la trastienda",
  error: {
    burbujas: [
      "Vaya, se me ha atascado la puerta de la trastienda.",
      "Pase a la tienda, que allí están todos los pares.",
    ],
    cta: "Ir a la tienda",
    // destino: config.tiendaZapatosUrl
  },
};

// ---------- R — Resultados ----------
const fragmentos = {
  ocasion: {
    diario: "el día a día",
    celebracion: "su celebración",
    caminar: "caminar mucho",
    casa: "estar en casa",
  } satisfies Record<Ocasion, string>,
  tiempo: {
    frio: "en días de frío",
    entretiempo: "en entretiempo",
    calor: "en días de calor",
  } satisfies Record<Tiempo, string>,
  tacon: {
    plano: "planos",
    bajo: "de poco tacón",
    tacon: "de tacón",
  } satisfies Record<Tacon, string>,
  color: {
    discretos: "en colores discretos",
    llamativos: "en colores llamativos",
    todos: "del color que sea",
  } satisfies Record<Exclude<ColorPreferido, "concreto">, string>,
  /** "Uno en concreto": "en negro", "en negro o marrón", "en negro, gris o burdeos". */
  tono: {
    negro: "negro",
    marron: "marrón",
    beige: "beige",
    blanco: "blanco",
    gris: "gris",
    marino: "azul marino",
    burdeos: "burdeos",
    azul: "azul",
    rojo: "rojo",
    rosa: "rosa",
    verde: "verde",
    metal: "metalizado",
    otro: "ese color",
  } satisfies Record<Tono, string>,
  /** Con más de 3 tonos la frase se haría larga. */
  variosTonos: "en los colores que me ha dicho",
};

/**
 * Relajación honesta (R1): qué tiene de distinto lo que se ha añadido. Se dice dentro de la
 * propia frase del resumen, entre paréntesis, para no alargar la cabecera.
 */
const diferencias = {
  color: "de otro color",
  tacon: {
    plano: "con algo de tacón",
    bajo: "algo más plano o más alto",
    tacon: "con menos tacón",
  } satisfies Record<Tacon, string>,
  temporada: "de otra temporada",
  conector: " o ",
};

const resultados = {
  etiqueta: "Los zapatos que le he sacado",
  /** Título de la página de resultados (petición del usuario). */
  titulo: "Recomendaciones",
  /** R1. Usar resumenRespuestas() de lib/texto.ts, que ya elige plantilla y relajación. */
  // Termina en punto, no en dos puntos: detrás viene el pacto (config.pacto) y luego los zapatos.
  plantilla: (o: string, t: string, ta: string, c: string, extra: string) =>
    `Para ${o}, ${t}, ${ta} y ${c}, yo le pondría estos${extra}.`,
  plantillaCasa: (c: string, extra: string) => `Para estar en casa y ${c}, yo le pondría estas${extra}.`,
  /** Paréntesis de relajación: masculino (zapatos) y femenino (zapatillas de casa). */
  relajacion: (dif: string) => ` (y alguno ${dif})`,
  relajacionCasa: (dif: string) => ` (y alguna ${dif})`,
  fragmentos,
  diferencias,
  // R2
  etiquetaCuadricula: "Lo que yo le pondría",
  comprar: "Comprar",
  precioAnteriorAccesible: "Antes",
  precioActualAccesible: "Ahora",
  /** Etiqueta corta de la tarjeta en móvil: "Salón · tacón bajo" (lib/texto.ts → etiquetaCorta). */
  etiquetaTacon: { plano: "plano", bajo: "tacón bajo", tacon: "tacón" } satisfies Record<Tacon, string>,
  /** Tipo por la primera palabra del nombre (si la reconoce) o, si no, por su categoría. */
  tipoPorPalabra: {
    salon: "Salón",
    mocasin: "Mocasín",
    botin: "Botín",
    bota: "Bota",
    sandalia: "Sandalia",
    bailarina: "Bailarina",
    mercedita: "Mercedita",
    merceditas: "Mercedita",
    alpargata: "Alpargata",
    zapatilla: "Zapatilla",
    sliper: "Zapatilla",
    zapato: "Zapato",
    deportiva: "Deportiva",
    veneciana: "Veneciana",
    venecianas: "Veneciana",
    chinela: "Chinela",
  } as Record<string, string>,
  tipoPorCategoria: {
    15: "Salón",
    16: "Mocasín",
    17: "Sport",
    18: "De vestir",
    19: "Sandalia",
    20: "Alpargata",
    21: "Bota",
    22: "Botín",
    23: "Zapatilla",
    40: "Bailarina",
    48: "Mercedita",
    51: "Deportiva",
  } as Record<number, string>,
  // R4
  masTitulo: "Más zapatos para usted",
  /** El único botón de la página: lleva a todos los zapatos de la tienda (config.tiendaZapatosUrl). */
  verTienda: "Ver toda la tienda",
  /** Solo en el error del recomendador. */
  volverAEmpezar: "Volver a empezar",
};

// ---------- Errores y estados vacíos (los dice Don Pedro) ----------
const errores = {
  /** Hueco de la foto en la tarjeta cuando la imagen no carga. */
  imagenCorta: "Se me ha escondido la foto",
  /** 404 (app/not-found.tsx). */
  noEncontrada: {
    titulo: "Por aquí no es · Don Pedro le atiende",
    burbujas: ["Vaya, esta puerta no lleva a ningún sitio.", "Vuelva a la entrada, que le atiendo yo."],
    cta: "Volver a la entrada",
  },
  /** Error inesperado de la aplicación (app/error.tsx). */
  aplicacion: {
    burbujas: ["Vaya, se me ha caído una caja del mostrador.", "Empecemos otra vez, que no tardo nada."],
    cta: "Volver a empezar",
  },
};

// ---------- Accesibilidad ----------
const accesible = {
  /** Prefijo que anuncia quién habla en las burbujas. */
  personajeDice: (nombre: string) => `${nombre} dice:`,
  principal: "Don Pedro le atiende",
};

// ---------- Pie ----------
const pie = {
  texto: "Zapatería Don Pedro · Paseo de la Habana, 50 · 28036 Madrid · Desde 1958",
  etiquetaNav: "Tienda e información legal",
  tienda: "Tienda",
  avisoLegal: "Aviso legal",
  privacidad: "Privacidad",
  cookies: "Cookies",
};

// ---------- Metadatos ----------
const meta = {
  titulo: "Don Pedro le atiende · Zapatería Don Pedro, Madrid",
  descripcion:
    "Cuatro preguntas y le saco los zapatos que yo le pondría. Zapatería Don Pedro, Paseo de la Habana, 50, Madrid. Desde 1958.",
};

export const textos = {
  fachada,
  entrada,
  sonido,
  saludo,
  preguntas: { q1, q2, q3, q4 },
  colores,
  quiz,
  trastienda,
  resultados,
  errores,
  accesible,
  pie,
  meta,
};
