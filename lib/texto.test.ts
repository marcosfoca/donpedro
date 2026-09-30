import { describe, expect, it } from "vitest";
import { formatoPrecio, resumenRespuestas, saludoPorHora, tipoOracion } from "./texto";

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

describe("resumen R1", () => {
  it("plantilla completa", () => {
    expect(
      resumenRespuestas({ ocasion: "diario", tiempo: "frio", tacon: "plano", color: "discretos" }),
    ).toBe("Para el día a día, en días de frío, planos y en colores discretos, yo le pondría estos:");
  });
  it("plantilla casa", () => {
    expect(resumenRespuestas({ ocasion: "casa", tiempo: null, tacon: null, color: "todos" })).toBe(
      "Para estar en casa y del color que sea, yo le pondría estas:",
    );
  });
  it("relajación dentro de la frase, diciendo qué tienen de distinto", () => {
    const r = { ocasion: "diario", tiempo: "frio", tacon: "bajo", color: "llamativos" } as const;
    expect(resumenRespuestas(r, [])).toBe(
      "Para el día a día, en días de frío, de poco tacón y en colores llamativos, yo le pondría estos:",
    );
    expect(resumenRespuestas(r, ["color", "tacon"])).toBe(
      "Para el día a día, en días de frío, de poco tacón y en colores llamativos, yo le pondría estos (y alguno de otro color o algo más plano o más alto):",
    );
    expect(resumenRespuestas({ ...r, tacon: "plano" }, ["estacion"])).toBe(
      "Para el día a día, en días de frío, planos y en colores llamativos, yo le pondría estos (y alguno de otra temporada):",
    );
  });
  it("casa: femenino y sin mencionar el color si es 'todos'", () => {
    const r = { ocasion: "casa", tiempo: null, tacon: null, color: "discretos" } as const;
    expect(resumenRespuestas(r, ["color"])).toBe(
      "Para estar en casa y en colores discretos, yo le pondría estas (y alguna de otro color):",
    );
    expect(resumenRespuestas({ ...r, color: "todos" }, ["color"])).toBe(
      "Para estar en casa y del color que sea, yo le pondría estas:",
    );
  });
  it("colores concretos: uno, dos, tres y más de tres", () => {
    const base = { ocasion: "casa", tiempo: null, tacon: null, color: "concreto" } as const;
    expect(resumenRespuestas({ ...base, tonos: ["negro"] })).toBe("Para estar en casa y en negro, yo le pondría estas:");
    expect(resumenRespuestas({ ...base, tonos: ["negro", "marino"] })).toBe(
      "Para estar en casa y en negro o azul marino, yo le pondría estas:",
    );
    expect(resumenRespuestas({ ...base, tonos: ["negro", "gris", "metal"] })).toBe(
      "Para estar en casa y en negro, gris o metalizado, yo le pondría estas:",
    );
    expect(resumenRespuestas({ ...base, tonos: ["negro", "gris", "rojo", "rosa"] })).toBe(
      "Para estar en casa y en los colores que me ha dicho, yo le pondría estas:",
    );
  });
});
