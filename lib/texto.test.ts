import { describe, expect, it } from "vitest";
import { formatoPrecio, MAX_FRASE, resumenRespuestas, saludoPorHora, tipoOracion } from "./texto";
import { TONOS_ELEGIBLES } from "@/lib/estado";
import type { Relajacion, Respuestas, Tono } from "@/types";

describe("tipoOracion", () => {
  it("convierte mayúsculas conservando tildes y eñes", () => {
    expect(tipoOracion("SALÓN CUÑA PIEL NEGRO")).toBe("Salón cuña piel negro");
  });
  it("repone tildes habituales que faltan", () => {
    expect(tipoOracion("SALON TACON BAJO MARRON")).toBe("Salón tacón bajo marrón");
    expect(tipoOracion("BAILARINA TALON PARIS ANTE BEIGE")).toBe("Bailarina talón París ante beige");
  });
  it("nombres propios de modelo y erratas del catálogo", () => {
    expect(tipoOracion("MOCASÍN CON ANTIFAZ TRIANA")).toBe("Mocasín con antifaz Triana");
    expect(tipoOracion("MOCASÍN PALA LISA CHAOL NEGRO")).toBe("Mocasín pala lisa charol negro");
    expect(tipoOracion("SANDALIA CON TIRAS TIRAS CRUZADAS Y TACÓN ALTO ALTO ROSA")).toBe(
      "Sandalia con tiras cruzadas y tacón alto rosa",
    );
    expect(tipoOracion("BAILARINA TRENZADA DESTALONADA PLAT")).toBe("Bailarina trenzada destalonada plata");
  });
});

describe("saludoPorHora", () => {
  const a = (h: number) => saludoPorHora(new Date(2026, 8, 29, h, 0));
  it("tramos", () => {
    expect(a(6)).toBe("Buenos días");
    expect(a(13)).toBe("Buenos días");
    expect(a(14)).toBe("Buenas tardes");
    expect(a(20)).toBe("Buenas tardes");
    expect(a(21)).toBe("Buenas noches");
    expect(a(3)).toBe("Buenas noches");
  });
});

describe("formatoPrecio", () => {
  it("formato español con espacio no separable", () => {
    expect(formatoPrecio(98)).toBe("98,00 €");
    expect(formatoPrecio(1234.5)).toBe("1.234,50 €");
  });
});

describe("resumen R1 (dos frases que caben en el cuadro)", () => {
  it("frases del resumen", () => {
    expect(resumenRespuestas({ ocasion: "diario", tiempo: "frio", tacon: "plano", color: "discretos" })).toEqual([
      "Para el día a día, con frío, planos…",
      "…y en colores discretos: le he sacado seis.",
    ]);
    expect(resumenRespuestas({ ocasion: "casa", tiempo: null, tacon: null, color: "todos" })).toEqual([
      "Unas zapatillas para estar en casa…",
      "…del color que sea: le he sacado seis.",
    ]);
  });
  it("la relajación va en su propia frase, sin paréntesis", () => {
    const r = { ocasion: "diario", tiempo: "frio", tacon: "bajo", color: "llamativos" } as const;
    expect(resumenRespuestas(r, ["color", "tacon"])[2]).toBe("Hay alguno de otro color o de otro tacón: no tenía más.");
    expect(resumenRespuestas({ ...r, tacon: "plano" }, ["estacion"])[2]).toBe("Hay alguno de otra temporada: no tenía más.");
    // Si no cabe, versión corta.
    expect(resumenRespuestas({ ...r, tacon: "plano" }, ["color", "tacon", "estacion"])[2]).toBe(
      "Hay alguno distinto de lo que me ha dicho.",
    );
  });
  it("casa: femenino y sin mencionar el color si es 'todos'", () => {
    const r = { ocasion: "casa", tiempo: null, tacon: null, color: "discretos" } as const;
    expect(resumenRespuestas(r, ["color"])[2]).toBe("Hay alguna de otro color: no tenía más.");
    expect(resumenRespuestas({ ...r, color: "todos" }, ["color"])).toHaveLength(2);
  });
  it("colores concretos: uno, dos, tres y los que no caben", () => {
    const base = { ocasion: "casa", tiempo: null, tacon: null, color: "concreto" } as const;
    expect(resumenRespuestas({ ...base, tonos: ["negro"] })[1]).toBe("…en negro: le he sacado seis.");
    expect(resumenRespuestas({ ...base, tonos: ["negro", "marino"] })[1]).toBe("…en negro o azul marino: le he sacado seis.");
    expect(resumenRespuestas({ ...base, tonos: ["negro", "gris", "rojo", "rosa"] })[1]).toBe(
      "…en los colores que me ha dicho: le he sacado seis.",
    );
  });
  it(`ninguna frase pasa de ${MAX_FRASE} caracteres (2 líneas a 375 px), en ninguna combinación`, () => {
    const colores: Pick<Respuestas, "color" | "tonos">[] = [
      { color: "discretos" },
      { color: "llamativos" },
      { color: "todos" },
      ...TONOS_ELEGIBLES.map((t) => ({ color: "concreto" as const, tonos: [t] })),
    ];
    // Las parejas y tríos más largos de nombres de tono.
    for (const a of TONOS_ELEGIBLES)
      for (const b of TONOS_ELEGIBLES)
        if (a !== b) {
          colores.push({ color: "concreto", tonos: [a, b] });
          colores.push({ color: "concreto", tonos: (["marino", a, b] as Tono[]).filter((x, i, v) => v.indexOf(x) === i) });
        }
    const rels: Relajacion[][] = [[], ["color"], ["tacon"], ["estacion"], ["color", "tacon"], ["color", "estacion"], ["tacon", "estacion"], ["color", "tacon", "estacion", "categorias"]];
    const largas: string[] = [];
    const respuestas: Respuestas[] = [];
    for (const ocasion of ["diario", "celebracion", "caminar"] as const)
      for (const tiempo of ["frio", "entretiempo", "calor"] as const)
        for (const tacon of ["plano", "bajo", "tacon"] as const)
          for (const c of colores) respuestas.push({ ocasion, tiempo, tacon, ...c });
    for (const c of colores) respuestas.push({ ocasion: "casa", tiempo: null, tacon: null, ...c });
    for (const r of respuestas)
      for (const rel of rels)
        for (const frase of resumenRespuestas(r, rel)) if (frase.length > MAX_FRASE) largas.push(frase);
    expect([...new Set(largas)]).toEqual([]);
  });
});
