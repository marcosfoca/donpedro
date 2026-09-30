"use client";
/**
 * Máquina de estados del recorrido (diseno.md §5.1 y §7).
 * fachada -> entrada -> saludo -> q1 -> q2 -> q3 -> q4 -> trastienda -> resultados
 * Regla: si q1 === "casa", se saltan q2 y q3 (y el progreso pasa a "de 2").
 * Se guarda en sessionStorage (try/catch) para sobrevivir a un refresco.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { config } from "@/content/config";
import { track } from "@/lib/track";
import type {
  Fase,
  FasePregunta,
  Respuestas,
  RespuestasParciales,
  Tono,
  ValorPregunta,
} from "@/types";

// ---------- Estado ----------
export type Estado = {
  fase: Fase;
  respuestas: RespuestasParciales;
  sonido: boolean;
  /** false hasta leer sessionStorage en el cliente. No se persiste. */
  hidratado: boolean;
};

export const ESTADO_INICIAL: Estado = {
  fase: "fachada",
  respuestas: {},
  sonido: config.sonidoPorDefecto,
  hidratado: false,
};

export const FASES: readonly Fase[] = [
  "fachada",
  "entrada",
  "saludo",
  "q1",
  "q2",
  "q3",
  "q4",
  "trastienda",
  "resultados",
];

export const PREGUNTAS: readonly FasePregunta[] = ["q1", "q2", "q3", "q4"];

/** Campo de RespuestasParciales que rellena cada pregunta. */
export const CAMPO_PREGUNTA = {
  q1: "ocasion",
  q2: "tiempo",
  q3: "tacon",
  q4: "color",
} as const satisfies Record<FasePregunta, keyof RespuestasParciales>;

export function esPregunta(fase: Fase): fase is FasePregunta {
  return (PREGUNTAS as readonly string[]).includes(fase);
}

function esCasa(r: RespuestasParciales) {
  return r.ocasion === "casa";
}

/** Preguntas activas según las respuestas (con "casa": q1 y q4). */
export function preguntasActivas(r: RespuestasParciales): FasePregunta[] {
  return esCasa(r) ? ["q1", "q4"] : ["q1", "q2", "q3", "q4"];
}

/** Fase siguiente (función pura). */
export function faseSiguiente(fase: Fase, r: RespuestasParciales): Fase {
  switch (fase) {
    case "fachada":
      return "entrada";
    case "entrada":
      return "saludo";
    case "saludo":
      return "q1";
    case "q1":
      return esCasa(r) ? "q4" : "q2";
    case "q2":
      return "q3";
    case "q3":
      return "q4";
    case "q4":
      return "trastienda";
    case "trastienda":
    case "resultados":
      return "resultados";
  }
}

/** Fase anterior para el botón "Atrás" (función pura). */
export function faseAnterior(fase: Fase, r: RespuestasParciales): Fase {
  switch (fase) {
    case "q1":
      return "saludo";
    case "q2":
      return "q1";
    case "q3":
      return "q2";
    case "q4":
      return esCasa(r) ? "q1" : "q3";
    case "trastienda":
    case "resultados":
      return "q4";
    case "saludo":
      return "saludo";
    case "entrada":
      return "fachada";
    case "fachada":
      return "fachada";
  }
}

/** Progreso de la pregunta actual, o null fuera del quiz. */
export function calcularProgreso(
  fase: Fase,
  r: RespuestasParciales,
): { paso: number; total: number } | null {
  if (!esPregunta(fase)) return null;
  const activas = preguntasActivas(r);
  const i = activas.indexOf(fase);
  return { paso: i >= 0 ? i + 1 : 1, total: activas.length };
}

/** Respuestas completas para el recomendador, o null si falta alguna. */
export function completarRespuestas(r: RespuestasParciales): Respuestas | null {
  if (!r.ocasion || !r.color) return null;
  // "Uno en concreto" sin ningún tono marcado no es una respuesta completa.
  if (r.color === "concreto" && !r.tonos?.length) return null;
  const color = r.color === "concreto" ? { color: r.color, tonos: [...(r.tonos ?? [])] } : { color: r.color };
  if (r.ocasion === "casa") return { ocasion: "casa", tiempo: null, tacon: null, ...color };
  if (!r.tiempo || !r.tacon) return null;
  return { ocasion: r.ocasion, tiempo: r.tiempo, tacon: r.tacon, ...color };
}

// ---------- Reducer ----------
export type Accion =
  | { tipo: "AVANZAR" }
  | { tipo: "RETROCEDER" }
  | { tipo: "IR_A"; fase: Fase }
  | { tipo: "RESPONDER"; pregunta: FasePregunta; valor: string }
  | { tipo: "TONOS"; tonos: Tono[] }
  | { tipo: "REINICIAR" }
  | { tipo: "SONIDO"; activo?: boolean }
  | { tipo: "HIDRATAR"; guardado: Partial<Estado> | null };

export function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "AVANZAR": {
      // En una pregunta sin responder no se avanza.
      if (esPregunta(estado.fase) && !estado.respuestas[CAMPO_PREGUNTA[estado.fase]]) return estado;
      return { ...estado, fase: faseSiguiente(estado.fase, estado.respuestas) };
    }
    case "RETROCEDER":
      return { ...estado, fase: faseAnterior(estado.fase, estado.respuestas) };
    case "IR_A":
      return { ...estado, fase: accion.fase };
    case "RESPONDER": {
      const respuestas = { ...estado.respuestas, [CAMPO_PREGUNTA[accion.pregunta]]: accion.valor };
      // Los tonos solo valen con "Uno en concreto".
      if (accion.pregunta === "q4" && accion.valor !== "concreto") delete respuestas.tonos;
      return { ...estado, respuestas };
    }
    case "TONOS":
      return { ...estado, respuestas: { ...estado.respuestas, color: "concreto", tonos: [...accion.tonos] } };
    case "REINICIAR":
      return { ...estado, fase: "q1", respuestas: {} };
    case "SONIDO":
      return { ...estado, sonido: accion.activo ?? !estado.sonido };
    case "HIDRATAR": {
      const g = accion.guardado;
      if (!g) return { ...estado, hidratado: true };
      let fase: Fase = g.fase && FASES.includes(g.fase) ? g.fase : estado.fase;
      // Las transiciones no se reanudan a medias.
      if (fase === "entrada") fase = "saludo";
      const respuestas = sanearRespuestas(g.respuestas);
      // Si la fase exige respuestas que no hay, se vuelve a la primera pregunta.
      if ((fase === "trastienda" || fase === "resultados") && !completarRespuestas(respuestas)) {
        fase = "q1";
      }
      return {
        fase,
        respuestas,
        sonido: typeof g.sonido === "boolean" ? g.sonido : estado.sonido,
        hidratado: true,
      };
    }
  }
}

const VALIDOS: Record<Exclude<keyof RespuestasParciales, "tonos">, readonly string[]> = {
  ocasion: ["diario", "celebracion", "caminar", "casa"],
  tiempo: ["frio", "entretiempo", "calor"],
  tacon: ["plano", "bajo", "tacon"],
  color: ["discretos", "llamativos", "todos", "concreto"],
};

/** Tonos que se pueden elegir en las muestras (el tono "otro" no tiene muestra). */
export const TONOS_ELEGIBLES: readonly Tono[] = [
  "negro", "marron", "beige", "blanco", "gris", "marino",
  "burdeos", "azul", "rojo", "rosa", "verde", "metal",
];

function sanearRespuestas(r: unknown): RespuestasParciales {
  if (!r || typeof r !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [campo, validos] of Object.entries(VALIDOS)) {
    const v = (r as Record<string, unknown>)[campo];
    if (typeof v === "string" && validos.includes(v)) out[campo] = v;
  }
  const tonos = (r as Record<string, unknown>).tonos;
  if (out.color === "concreto" && Array.isArray(tonos)) {
    const validos = [...new Set(tonos)].filter((t): t is Tono => TONOS_ELEGIBLES.includes(t as Tono));
    if (validos.length) out.tonos = validos;
  }
  return out as RespuestasParciales;
}

// ---------- Persistencia ----------
const CLAVE = "donpedro:estado:v1";

function leer(): Partial<Estado> | null {
  try {
    const crudo = window.sessionStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Partial<Estado>) : null;
  } catch {
    return null;
  }
}

function guardar(e: Estado) {
  try {
    const { fase, respuestas, sonido } = e;
    window.sessionStorage.setItem(CLAVE, JSON.stringify({ fase, respuestas, sonido }));
  } catch {
    // Modo privado o almacenamiento lleno: se sigue sin persistir.
  }
}

// ---------- Contexto ----------
export type ApiEstado = {
  estado: Estado;
  fase: Fase;
  respuestas: RespuestasParciales;
  /** Respuestas completas (para recomendar) o null si faltan. */
  respuestasCompletas: Respuestas | null;
  sonido: boolean;
  hidratado: boolean;
  /** { paso, total } en q1..q4; null fuera del quiz. Con "casa", total = 2. */
  progreso: { paso: number; total: number } | null;
  /** Pasa a la fase siguiente (aplica la regla "casa"). No avanza una pregunta sin responder. */
  avanzar: () => void;
  /** Vuelve a la fase anterior conservando las respuestas. */
  retroceder: () => void;
  /** Salto directo (p. ej. "Saltar"). Úsese con moderación. */
  irA: (fase: Fase) => void;
  /** Guarda la respuesta (NO avanza) y dispara track("pregunta_respondida"). */
  responder: <P extends FasePregunta>(pregunta: P, valor: ValorPregunta[P]) => void;
  /** Q4 "Uno en concreto": guarda los tonos elegidos (NO avanza) y lo mide. */
  elegirTonos: (tonos: Tono[]) => void;
  /** Vuelve a q1 con respuestas vacías y dispara track("reinicio"). */
  reiniciar: () => void;
  /** Alterna el sonido, o lo fija si se pasa un booleano. */
  alternarSonido: (activo?: boolean) => void;
};

const Contexto = createContext<ApiEstado | null>(null);

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, ESTADO_INICIAL);

  useEffect(() => {
    dispatch({ tipo: "HIDRATAR", guardado: leer() });
  }, []);

  useEffect(() => {
    if (estado.hidratado) guardar(estado);
  }, [estado]);

  const avanzar = useCallback(() => dispatch({ tipo: "AVANZAR" }), []);
  const retroceder = useCallback(() => dispatch({ tipo: "RETROCEDER" }), []);
  const irA = useCallback((fase: Fase) => dispatch({ tipo: "IR_A", fase }), []);
  const responder = useCallback(
    <P extends FasePregunta>(pregunta: P, valor: ValorPregunta[P]) => {
      dispatch({ tipo: "RESPONDER", pregunta, valor });
      track("pregunta_respondida", { n: PREGUNTAS.indexOf(pregunta) + 1, id: valor });
    },
    [],
  );
  const elegirTonos = useCallback((tonos: Tono[]) => {
    dispatch({ tipo: "TONOS", tonos });
    track("pregunta_respondida", { n: 4, id: "concreto", tonos: tonos.join(",") });
  }, []);
  const reiniciar = useCallback(() => {
    dispatch({ tipo: "REINICIAR" });
    track("reinicio");
  }, []);
  const alternarSonido = useCallback(
    (activo?: boolean) => dispatch({ tipo: "SONIDO", activo }),
    [],
  );

  const api = useMemo<ApiEstado>(
    () => ({
      estado,
      fase: estado.fase,
      respuestas: estado.respuestas,
      respuestasCompletas: completarRespuestas(estado.respuestas),
      sonido: estado.sonido,
      hidratado: estado.hidratado,
      progreso: calcularProgreso(estado.fase, estado.respuestas),
      avanzar,
      retroceder,
      irA,
      responder,
      elegirTonos,
      reiniciar,
      alternarSonido,
    }),
    [estado, avanzar, retroceder, irA, responder, elegirTonos, reiniciar, alternarSonido],
  );

  return <Contexto.Provider value={api}>{children}</Contexto.Provider>;
}

export function useEstado(): ApiEstado {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useEstado() debe usarse dentro de <EstadoProvider>");
  return ctx;
}
