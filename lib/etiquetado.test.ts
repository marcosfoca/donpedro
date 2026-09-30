import { describe, expect, it } from "vitest";
import {
  aplicarManuales,
  buscarColor,
  calcularModelo,
  esDeCaballero,
  etiquetar,
  etiquetarColor,
  etiquetarEstaciones,
  etiquetarTacon,
  normalizar,
  urlCategoria,
  type ProductoBruto,
} from "@/lib/etiquetado";
import { etiquetasManuales } from "@/content/etiquetas-manuales";
import catalogoJson from "@/content/catalogo.json";
import type { Producto } from "@/types";

const catalogo = catalogoJson as Producto[];

const bruto = (over: Partial<ProductoBruto> = {}): ProductoBruto => ({
  id: 1,
  idAtributo: 0,
  nombre: "SALÓN PIEL NEGRO",
  url: "https://donpedrohabana.com/x.html",
  imagen: "https://donpedrohabana.com/x.jpg",
  precio: 98,
  descripcion: "",
  categorias: [15],
  ...over,
});

describe("normalizar", () => {
  it("quita tildes, pasa a mayúsculas y limpia signos", () => {
    expect(normalizar("Salón cuña  Marrón")).toBe("SALON CUNA MARRON");
    expect(normalizar("BEIGE-AZUL")).toBe("BEIGE AZUL");
    expect(normalizar("  ante, pingüino. ")).toBe("ANTE PINGUINO");
  });
});

describe("tacón", () => {
  it("categorías planas → plano", () => {
    for (const c of [40, 17, 51, 48, 23, 16]) expect(etiquetarTacon("ZAPATO PIEL", "", [c])).toBe("plano");
    expect(etiquetarTacon("ALPARGATA YUTE", "", [20])).toBe("plano");
  });
  it("alpargata con cuña no es plana", () => {
    expect(etiquetarTacon("ALPARGATA CUÑA YUTE", "", [20])).toBe("bajo");
    expect(etiquetarTacon("ALPARGATA LONA", "Alpargata de cuña media", [20])).toBe("bajo");
  });
  it("familia plana con tacón en el nombre → bajo (salvo casa)", () => {
    expect(etiquetarTacon("BAILARINA CON TACÓN MEDIO BEIGE", "", [40])).toBe("bajo");
    expect(etiquetarTacon("MOCASÍN CON ANTIFAZ Y TACÓN NEGRO", "", [16])).toBe("bajo");
    expect(etiquetarTacon("ZAPATILLA CON CUÑA DE PANA", "", [23])).toBe("plano");
  });
  it("palabras clave de bajo", () => {
    expect(etiquetarTacon("SALÓN SIN FORRO CUÑA NEGRO", "", [15])).toBe("bajo");
    expect(etiquetarTacon("SALÓN TACON BAJO PIEL", "", [15])).toBe("bajo");
    expect(etiquetarTacon("SALÓN TACÓN MEDIO NEGRO", "", [15])).toBe("bajo");
    expect(etiquetarTacon("SALÓN LAZO", "SALÓN CÓMODO PARA LAS QUE NO QUIEREN IR CON MUCHO TACÓN", [15])).toBe("bajo");
    expect(etiquetarTacon("SALÓN X", "con poco tacón", [15])).toBe("bajo");
  });
  it("tacón y plano por palabras", () => {
    expect(etiquetarTacon("SALÓN DE TACÓN EN PIEL NEGRO", "", [15])).toBe("tacon");
    expect(etiquetarTacon("SALÓN ESTILETO TERCIOPELO", "", [18])).toBe("tacon");
    expect(etiquetarTacon("BOTIN PLANO DE ANTE NEGRO", "", [22])).toBe("plano");
    expect(etiquetarTacon("SANDALIA X", "sandalia sin tacón", [19])).toBe("plano");
  });
  it("el nombre manda sobre la descripción", () => {
    expect(etiquetarTacon("SALÓN CUÑA", "PUNTERA Y TACÓN CHAROL", [15])).toBe("bajo");
  });
  it("sin palabra clave en salones/vestir/sandalias/botas/botines → null", () => {
    for (const c of [15, 18, 19, 21, 22]) expect(etiquetarTacon("MODELO TERCIOPELO", "ELEGANTE", [c])).toBeNull();
  });
});

describe("color", () => {
  it("toma el PRIMER tono (el dominante en combinaciones)", () => {
    expect(etiquetarColor("SALÓN PIEL NEGRO")).toBe("negro");
    expect(etiquetarColor("SALÓN BEIGE LAZO")).toBe("beige");
    expect(etiquetarColor("BAILARINA BEIGE-AZUL")).toBe("beige");
    expect(etiquetarColor("SALÓN DESTALONADO BICOLOR MARINO-BEIGE")).toBe("marino");
    expect(etiquetarColor("PADME NEGRO/ORO")).toBe("negro");
  });
  it("frases de varias palabras y matices", () => {
    expect(etiquetarColor("CHINELA AZUL MARINO")).toBe("marino");
    expect(etiquetarColor("SALÓN AZUL")).toBe("azul");
    expect(etiquetarColor("SALÓN GRIS OSCURO")).toBe("gris");
    expect(etiquetarColor("SANDALIA ROSA OSCURO")).toBe("rosa");
    expect(etiquetarColor("SALÓN DE TACÓN PLATA VIEJA")).toBe("metal");
    expect(etiquetarColor("MOCASÍN MARRÓN")).toBe("marron");
    expect(etiquetarColor("BOTÍN CAMEL")).toBe("marron");
    expect(etiquetarColor("SALÓN BURDEOS")).toBe("burdeos");
    expect(etiquetarColor("SANDALIA MOSTAZA")).toBe("otro");
    expect(etiquetarColor("SALÓN BICOLOR")).toBe("otro");
  });
  it("sin color reconocible → null", () => {
    expect(etiquetarColor("ZAPATO SOFT PIEL ELASTICO")).toBeNull();
    expect(buscarColor("ALPARGATA CABALLERO")).toBeNull();
  });
});

describe("estaciones", () => {
  it("por categoría", () => {
    expect(etiquetarEstaciones("BOTA X", "", [21])).toEqual(["frio"]);
    expect(etiquetarEstaciones("SANDALIA X", "", [19])).toEqual(["calor"]);
    expect(etiquetarEstaciones("BAILARINA X", "", [40])).toEqual(["entretiempo", "calor"]);
    expect(etiquetarEstaciones("SALÓN X", "", [15])).toEqual(["frio", "entretiempo", "calor"]);
    expect(etiquetarEstaciones("ZAPATILLA X", "", [23])).toEqual(["frio", "entretiempo", "calor"]);
  });
  it("el tipo de zapato manda sobre la categoría (auditoría C1)", () => {
    // sandalia: nunca de frío; si es de vestir (fiesta), también entretiempo
    expect(etiquetarEstaciones("SANDALIA X", "", [19, 20])).toEqual(["calor"]);
    expect(etiquetarEstaciones("SANDALIA X", "", [18, 19])).toEqual(["entretiempo", "calor"]);
    expect(etiquetarEstaciones("SANDALIA PLATAFORMA ANTE NEGRO", "con forro de piel", [18])).toEqual(["entretiempo", "calor"]);
    expect(etiquetarEstaciones("SANDALIA X", "forrada de borrego", [19])).toEqual(["calor"]);
    // bota y botín: nunca de calor
    expect(etiquetarEstaciones("BOTA CAÑA ALTA", "", [21])).toEqual(["frio"]);
    expect(etiquetarEstaciones("BOTÍN TACÓN ANTE", "", [18])).toEqual(["frio", "entretiempo"]);
  });
  it("varias categorías: manda la más específica (intersección)", () => {
    expect(etiquetarEstaciones("MERCEDITA X", "", [48, 18])).toEqual(["entretiempo", "calor"]);
  });
  it("FORRO/LANA/BORREGO/ANTE añaden frío; SIN FORRO no", () => {
    expect(etiquetarEstaciones("BAILARINA ANTE", "", [40])).toEqual(["frio", "entretiempo", "calor"]);
    expect(etiquetarEstaciones("MERCEDITA SIN FORRO", "", [48])).toEqual(["entretiempo", "calor"]);
  });
});

describe("modelo", () => {
  it("colapsa palabras repetidas por erratas del catálogo", () => {
    expect(calcularModelo("SANDALIA CON TIRAS TIRAS CRUZADAS Y TACON ALTO ALTO ROSA")).toBe(
      calcularModelo("SANDALIA CON TIRAS CRUZADAS Y TACON ALTO NEGRO"),
    );
  });
  it("quita el color (y sus matices) y el relleno", () => {
    expect(calcularModelo("SALÓN CUÑA PIEL NEGRO")).toBe("SALON CUNA PIEL");
    expect(calcularModelo("SALÓN CUÑA PIEL TAUPE")).toBe("SALON CUNA PIEL");
    expect(calcularModelo("SALÓN DE TACÓN EN PIEL NEGRO")).toBe(calcularModelo("SALÓN DE TACÓN PIEL VERDE"));
    expect(calcularModelo("SALÓN DE TACÓN PLATA VIEJA")).toBe(calcularModelo("SALÓN DE TACÓN ORO VIEJO"));
    expect(calcularModelo("SALÓN DESTALONADO BICOLOR")).toBe(calcularModelo("SALÓN DESTALONADO BICOLOR BEIGE-NEGRO"));
  });
  it("no deja el modelo vacío", () => {
    expect(calcularModelo("NEGRO")).toBe("NEGRO");
  });
});

describe("exclusiones", () => {
  it("productos de caballero", () => {
    expect(esDeCaballero("ZAPATILLA CABALLERO CERRADA MARRÓN")).toBe(true);
    expect(esDeCaballero("Alpargata hombre")).toBe(true);
    expect(esDeCaballero("SALÓN PIEL NEGRO")).toBe(false);
  });
  it("el catálogo real no los incluye", () => {
    expect(catalogo.filter((p) => esDeCaballero(p.nombre))).toEqual([]);
  });
});

describe("overrides manuales", () => {
  it("tienen prioridad solo en los campos presentes", () => {
    const auto = etiquetar(bruto({ id: 7, nombre: "SALÓN MISTERIO NEGRO" }));
    expect(auto.tacon).toBeNull();
    const man = etiquetar(bruto({ id: 7, nombre: "SALÓN MISTERIO NEGRO" }), { 7: { tacon: "bajo" } });
    expect(man.tacon).toBe("bajo");
    expect(man.color).toBe("negro");
    expect(man.modelo).toBe(auto.modelo);
  });
  it("pueden fijar color, estaciones (orden canónico) y modelo", () => {
    const p = aplicarManuales(etiquetar(bruto({ id: 9 })), {
      9: { color: "rojo", estaciones: ["calor", "frio"], modelo: "OTRO" },
    });
    expect(p.color).toBe("rojo");
    expect(p.estaciones).toEqual(["frio", "calor"]);
    expect(p.modelo).toBe("OTRO");
  });
  it("un producto sin override no cambia", () => {
    const p = etiquetar(bruto({ id: 123456 }));
    expect(aplicarManuales(p, etiquetasManuales)).toEqual(p);
  });
});

describe("catálogo real (content/catalogo.json)", () => {
  it("tiene productos válidos y únicos", () => {
    expect(catalogo.length).toBeGreaterThan(300);
    expect(new Set(catalogo.map((p) => p.id)).size).toBe(catalogo.length);
    for (const p of catalogo) {
      expect(p.url).toMatch(/^https:\/\/donpedrohabana\.com\/.+\.html$/);
      expect(p.url).not.toContain("#");
      expect(p.imagen).toMatch(/^https:\/\/donpedrohabana\.com\//);
      expect(p.precio).toBeGreaterThan(0);
      expect(p.categorias.length).toBeGreaterThan(0);
      expect(p.estaciones.length).toBeGreaterThan(0);
      expect(p.modelo).toBeTruthy();
    }
  });
  it("está etiquetado con las reglas y manuales actuales (si falla: npm run sync)", () => {
    for (const p of catalogo) {
      const { modelo, tacon, color, estaciones, ...resto } = p;
      const re = etiquetar(resto, etiquetasManuales);
      expect({ id: p.id, modelo, tacon, color, estaciones }).toEqual({
        id: p.id,
        modelo: re.modelo,
        tacon: re.tacon,
        color: re.color,
        estaciones: re.estaciones,
      });
    }
  });
  it("los overrides apuntan a productos que existen", () => {
    const ids = new Set(catalogo.map((p) => p.id));
    const huerfanos = Object.keys(etiquetasManuales).map(Number).filter((id) => !ids.has(id));
    // Si un producto se retira de la web, su override queda huérfano: avisar, no romper.
    expect(huerfanos.length).toBeLessThan(Object.keys(etiquetasManuales).length / 2);
  });
  it("urlCategoria", () => {
    expect(urlCategoria(15)).toBe("https://donpedrohabana.com/15-salones");
    expect(urlCategoria(23)).toBe("https://donpedrohabana.com/23-zapatillas-de-casa");
  });
});
