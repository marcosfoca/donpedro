import { describe, expect, it } from "vitest";
import {
  ESTADO_INICIAL,
  calcularProgreso,
  completarRespuestas,
  reducer,
  type Accion,
  type Estado,
} from "./estado";

const correr = (acciones: Accion[], desde: Estado = ESTADO_INICIAL) => acciones.reduce(reducer, desde);
const AV: Accion = { tipo: "AVANZAR" };

describe("máquina de estados", () => {
  it("recorre el camino completo", () => {
    const e = correr([
      AV, AV, AV, // fachada -> entrada -> saludo -> q1
      { tipo: "RESPONDER", pregunta: "q1", valor: "diario" }, AV,
      { tipo: "RESPONDER", pregunta: "q2", valor: "frio" }, AV,
      { tipo: "RESPONDER", pregunta: "q3", valor: "plano" }, AV,
      { tipo: "RESPONDER", pregunta: "q4", valor: "discretos" }, AV, AV,
    ]);
    expect(e.fase).toBe("resultados");
    expect(completarRespuestas(e.respuestas)).toEqual({
      ocasion: "diario", tiempo: "frio", tacon: "plano", color: "discretos",
    });
  });

  it("\"Uno en concreto\" necesita al menos un tono, y otra respuesta los borra", () => {
    const base = correr([
      { tipo: "RESPONDER", pregunta: "q1", valor: "casa" },
      { tipo: "RESPONDER", pregunta: "q4", valor: "concreto" },
    ]);
    expect(completarRespuestas(base.respuestas)).toBeNull();
    const con = correr([{ tipo: "TONOS", tonos: ["negro", "burdeos"] }], base);
    expect(completarRespuestas(con.respuestas)).toEqual({
      ocasion: "casa", tiempo: null, tacon: null, color: "concreto", tonos: ["negro", "burdeos"],
    });
    const otra = correr([{ tipo: "RESPONDER", pregunta: "q4", valor: "todos" }], con);
    expect(otra.respuestas).toEqual({ ocasion: "casa", color: "todos" });
  });

  it("no avanza una pregunta sin responder", () => {
    const e = correr([AV, AV, AV, AV]);
    expect(e.fase).toBe("q1");
  });

  it("casa salta q2 y q3, y el progreso es de 2", () => {
    const e = correr([AV, AV, AV, { tipo: "RESPONDER", pregunta: "q1", valor: "casa" }, AV]);
    expect(e.fase).toBe("q4");
    expect(calcularProgreso(e.fase, e.respuestas)).toEqual({ paso: 2, total: 2 });
    expect(correr([{ tipo: "RETROCEDER" }], e).fase).toBe("q1");
    const fin = correr([{ tipo: "RESPONDER", pregunta: "q4", valor: "todos" }], e);
    expect(completarRespuestas(fin.respuestas)).toEqual({
      ocasion: "casa", tiempo: null, tacon: null, color: "todos",
    });
  });

  it("atrás conserva respuestas", () => {
    const e = correr([
      AV, AV, AV,
      { tipo: "RESPONDER", pregunta: "q1", valor: "caminar" }, AV,
      { tipo: "RESPONDER", pregunta: "q2", valor: "calor" }, AV,
      { tipo: "RETROCEDER" },
    ]);
    expect(e.fase).toBe("q2");
    expect(e.respuestas).toEqual({ ocasion: "caminar", tiempo: "calor" });
  });

  it("reiniciar vuelve a q1 sin respuestas", () => {
    const e = correr([{ tipo: "IR_A", fase: "resultados" }, { tipo: "REINICIAR" }]);
    expect(e.fase).toBe("q1");
    expect(e.respuestas).toEqual({});
  });

  it("hidratar sanea valores y no reanuda transiciones", () => {
    const e = reducer(ESTADO_INICIAL, {
      tipo: "HIDRATAR",
      guardado: {
        fase: "entrada",
        respuestas: { ocasion: "xx" as never, color: "concreto", tonos: ["negro", "fucsia" as never, "negro"] },
      },
    });
    expect(e.fase).toBe("saludo");
    expect(e.respuestas).toEqual({ color: "concreto", tonos: ["negro"] });
    expect(e.hidratado).toBe(true);
    const r = reducer(ESTADO_INICIAL, { tipo: "HIDRATAR", guardado: { fase: "resultados", respuestas: {} } });
    expect(r.fase).toBe("q1");
  });

  it("sonido apagado por defecto", () => {
    expect(ESTADO_INICIAL.sonido).toBe(false);
    expect(reducer(ESTADO_INICIAL, { tipo: "SONIDO" }).sonido).toBe(true);
  });
});
