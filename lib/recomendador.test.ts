import { describe, expect, it } from "vitest";
import {
  catalogo,
  crearRecomendador,
  filaDe,
  ORDEN_RELAJACION,
  ORDEN_RELAJACION_CONCRETO,
  puntuar,
  recomendar,
  TABLA,
  tonosAceptados,
} from "@/lib/recomendador";
import { TONOS_ELEGIBLES } from "@/lib/estado";
import { config } from "@/content/config";
import type { Producto, Respuestas, Tacon, Tiempo } from "@/types";

const OCASIONES = ["diario", "celebracion", "caminar"] as const;
const TIEMPOS: Tiempo[] = ["frio", "entretiempo", "calor"];
const TACONES: Tacon[] = ["plano", "bajo", "tacon"];
/** Discretos, llamativos, cualquiera, cada muestra sola y una pareja habitual. */
const COLORES: Pick<Respuestas, "color" | "tonos">[] = [
  { color: "discretos" },
  { color: "llamativos" },
  { color: "todos" },
  ...TONOS_ELEGIBLES.map((t) => ({ color: "concreto" as const, tonos: [t] })),
  { color: "concreto", tonos: ["negro", "marron"] },
];
const nombreColor = (r: Pick<Respuestas, "color" | "tonos">) => (r.tonos ? r.tonos.join("+") : r.color);

function todasLasCombinaciones(): Respuestas[] {
  const out: Respuestas[] = [];
  for (const ocasion of OCASIONES)
    for (const tiempo of TIEMPOS)
      for (const tacon of TACONES)
        for (const color of COLORES) out.push({ ocasion, tiempo, tacon, ...color });
  for (const color of COLORES) out.push({ ocasion: "casa", tiempo: null, tacon: null, ...color });
  return out;
}

const COMBOS = todasLasCombinaciones();

describe("todas las combinaciones con el catálogo real", () => {
  it("son 3 × 3 × 3 × 16 + 16", () => {
    expect(COMBOS).toHaveLength(3 * 3 * 3 * COLORES.length + COLORES.length);
  });

  it.each(COMBOS.map((r) => [`${r.ocasion}/${r.tiempo}/${r.tacon}/${nombreColor(r)}`, r] as const))(
    "%s → exactamente 6 modelos distintos",
    (_, r) => {
      const res = recomendar(r);
      expect(res.top).toHaveLength(config.numRecomendaciones);
      expect(new Set(res.top.map((p) => p.modelo)).size).toBe(config.numRecomendaciones);
      // top: todos de la ocasión elegida (fila o, si se relajó, otras filas de la misma ocasión)
      const permitidas = r.ocasion === "casa" ? [23] : Object.values(TABLA[r.ocasion]).flat();
      for (const p of res.top) expect(p.categorias.some((c) => permitidas.includes(c))).toBe(true);
      if (!res.relajaciones.includes("categorias")) {
        const fila = filaDe(r);
        for (const p of res.top) expect(p.categorias.some((c) => fila.includes(c))).toBe(true);
      }
      // mas: sin repetir productos del top, máx. 2 por modelo, tope de config
      expect(res.mas.length).toBeLessThanOrEqual(config.maxMasZapatos);
      const idsTop = new Set(res.top.map((p) => p.id));
      for (const p of res.mas) expect(idsTop.has(p.id)).toBe(false);
      const cuenta = new Map<string, number>();
      for (const p of res.mas) cuenta.set(p.modelo, (cuenta.get(p.modelo) ?? 0) + 1);
      for (const n of cuenta.values()) expect(n).toBeLessThanOrEqual(2);
      expect(new Set(res.mas.map((p) => p.id)).size).toBe(res.mas.length);
      // urlTienda = primera categoría de la fila
      expect(res.urlTienda).toMatch(new RegExp(`^https://donpedrohabana\\.com/${filaDe(r)[0]}-`));
      // relajaciones en el orden de §5.3 y sin repetir
      const orden: readonly string[] = r.color === "concreto" ? ORDEN_RELAJACION_CONCRETO : ORDEN_RELAJACION;
      const idx = res.relajaciones.map((x) => orden.indexOf(x));
      expect([...idx].sort((a, b) => a - b)).toEqual(idx);
      expect(new Set(res.relajaciones).size).toBe(res.relajaciones.length);
    },
  );

  it("es determinista: misma entrada, misma salida", () => {
    for (const r of COMBOS) {
      const a = recomendar(r);
      const b = recomendar({ ...r } as Respuestas);
      expect(b.top.map((p) => p.id)).toEqual(a.top.map((p) => p.id));
      expect(b.mas.map((p) => p.id)).toEqual(a.mas.map((p) => p.id));
      expect(b.relajaciones).toEqual(a.relajaciones);
    }
  });

  it("no depende del orden del catálogo", () => {
    const alReves = crearRecomendador([...catalogo].reverse());
    for (const r of COMBOS) expect(alReves(r).top.map((p) => p.id)).toEqual(recomendar(r).top.map((p) => p.id));
  });

  it("sin relajación de tacón, nada del top contradice el tacón pedido", () => {
    for (const r of COMBOS) {
      if (r.tacon === null) continue;
      const res = recomendar(r);
      if (res.relajaciones.includes("tacon")) continue;
      for (const p of res.top) expect(p.tacon === r.tacon || p.tacon === null).toBe(true);
    }
  });

  it("casa: solo zapatillas de casa y URL de la categoría 23", () => {
    const res = recomendar({ ocasion: "casa", tiempo: null, tacon: null, color: "todos" });
    for (const p of res.top) expect(p.categorias).toContain(23);
    expect(res.urlTienda).toBe("https://donpedrohabana.com/23-zapatillas-de-casa");
  });
});

// ---------- Catálogo sintético para comprobar reglas concretas ----------
let sig = 1;
const prod = (o: Partial<Producto>): Producto => {
  const id = o.id ?? sig++;
  return {
    id,
    idAtributo: 0,
    nombre: `P${id}`,
    modelo: o.modelo ?? `M${id}`,
    url: `https://donpedrohabana.com/${id}.html`,
    imagen: "",
    precio: 50,
    descripcion: "",
    categorias: [18],
    tacon: "tacon",
    color: "negro",
    estaciones: ["frio", "entretiempo", "calor"],
    ...o,
  };
};
const cfg = { numRecomendaciones: 6, maxMasZapatos: 30 };
const R: Respuestas = { ocasion: "celebracion", tiempo: "entretiempo", tacon: "tacon", color: "discretos" };

describe("reglas de §5.3 (catálogo sintético)", () => {
  it("puntuación", () => {
    const fila = filaDe(R); // [18, 15]
    expect(puntuar(prod({ categorias: [18] }), R, fila)).toBe(3 + 2 + 1 + 1);
    expect(puntuar(prod({ categorias: [15] }), R, fila)).toBe(3 + 2 + 1);
    expect(puntuar(prod({ tacon: null, color: null }), R, fila)).toBe(1 + 0.5 + 1 + 1);
    expect(puntuar(prod({ tacon: "plano", color: "rojo" }), R, fila)).toBe(-5 + -5 + 1 + 1);
    // fuera de temporada excluye (−5), igual que color y tacón
    expect(puntuar(prod({ estaciones: ["frio"] }), R, fila)).toBe(3 + 2 - 5 + 1);
    expect(puntuar(prod({ color: "rojo" }), { ...R, color: "todos" }, fila)).toBe(3 + 2 + 1 + 1);
    // "Uno en concreto": solo los tonos elegidos
    const negroOBurdeos: Respuestas = { ...R, color: "concreto", tonos: ["negro", "burdeos"] };
    expect(puntuar(prod({ color: "burdeos" }), negroOBurdeos, fila)).toBe(3 + 2 + 1 + 1);
    expect(puntuar(prod({ color: "marron" }), negroOBurdeos, fila)).toBe(3 - 5 + 1 + 1);
    // llamativos: todo lo que no es discreto (incluido "otro": amarillo, estampados…)
    const llamativos: Respuestas = { ...R, color: "llamativos" };
    expect(puntuar(prod({ color: "otro" }), llamativos, fila)).toBe(3 + 2 + 1 + 1);
    expect(puntuar(prod({ color: "beige" }), llamativos, fila)).toBe(3 - 5 + 1 + 1);
  });

  it("discretos y llamativos se reparten todos los tonos sin solaparse", () => {
    const d = tonosAceptados({ color: "discretos" })!;
    const l = tonosAceptados({ color: "llamativos" })!;
    expect([...d].filter((t) => l.has(t))).toEqual([]);
    expect(d.size + l.size).toBe(13);
    expect(tonosAceptados({ color: "todos" })).toBeNull();
  });

  it("desempate: precio desc y luego id asc", () => {
    const ps = [
      prod({ id: 10, precio: 60 }),
      prod({ id: 3, precio: 90 }),
      prod({ id: 2, precio: 60 }),
      ...Array.from({ length: 6 }, (_, i) => prod({ id: 100 + i, precio: 10 })),
    ];
    const res = crearRecomendador(ps, cfg)(R);
    expect(res.top.slice(0, 3).map((p) => p.id)).toEqual([3, 2, 10]);
    expect(res.relajaciones).toEqual([]);
  });

  it("top sin modelos repetidos; mas máx. 2 por modelo", () => {
    const ps = [
      ...Array.from({ length: 5 }, (_, i) => prod({ id: 200 + i, modelo: "REPE", precio: 100 - i })),
      ...Array.from({ length: 6 }, (_, i) => prod({ id: 300 + i, precio: 20 })),
    ];
    const res = crearRecomendador(ps, cfg)(R);
    expect(res.top.filter((p) => p.modelo === "REPE")).toHaveLength(1);
    expect(res.top[0].id).toBe(200);
    expect(res.mas.filter((p) => p.modelo === "REPE").map((p) => p.id)).toEqual([201, 202]);
  });

  it("relajación 1: color", () => {
    const ps = [
      ...Array.from({ length: 3 }, () => prod({ color: "negro" })),
      // tacón sin etiqueta (+1), color que no encaja (−5), de temporada (+1), fuera de la 1.ª categoría → −3;
      // al ignorar el color: 1 + 2 + 1 = 4 ≥ 3
      ...Array.from({ length: 5 }, () => prod({ categorias: [15], tacon: null, color: "rojo" })),
    ];
    const res = crearRecomendador(ps, cfg)(R);
    expect(res.relajaciones).toEqual(["color"]);
    expect(res.top).toHaveLength(6);
    // lo que encaja de verdad sale primero
    expect(res.top.slice(0, 3).every((p) => p.color === "negro")).toBe(true);
  });

  it("relajación 2: tacón adyacente (no el opuesto)", () => {
    const ps = [
      ...Array.from({ length: 2 }, () => prod({})),
      ...Array.from({ length: 5 }, () => prod({ tacon: "bajo", color: "rojo" })),
      ...Array.from({ length: 5 }, () => prod({ tacon: "plano", precio: 999 })),
    ];
    const res = crearRecomendador(ps, cfg)(R);
    expect(res.relajaciones).toEqual(["color", "tacon"]);
    expect(res.top.every((p) => p.tacon !== "plano")).toBe(true);
    expect(res.top.slice(0, 2).every((p) => p.tacon === "tacon")).toBe(true);
  });

  it("relajación 3: categorías de otras filas de la misma ocasión", () => {
    const ps = [
      ...Array.from({ length: 2 }, () => prod({})),
      ...Array.from({ length: 5 }, () => prod({ categorias: [19] })), // sandalias: fila celebracion/calor
      ...Array.from({ length: 5 }, () => prod({ categorias: [17] })), // sport: otra ocasión, no entra
    ];
    const res = crearRecomendador(ps, cfg)(R);
    expect(res.relajaciones).toEqual(["color", "tacon", "estacion", "categorias"]);
    expect(res.top.every((p) => !p.categorias.includes(17))).toBe(true);
    expect(res.urlTienda).toBe("https://donpedrohabana.com/18-vestir");
  });

  it("color 'todos' no registra relajación de color", () => {
    const ps = [...Array.from({ length: 2 }, () => prod({})), ...Array.from({ length: 5 }, () => prod({ tacon: "bajo" }))];
    const res = crearRecomendador(ps, cfg)({ ...R, color: "todos" });
    expect(res.relajaciones).toEqual(["tacon"]);
  });
});

// Honestidad (auditoría de integración): lo que se enseña en el top nunca contradice el color
// ni el tacón pedidos salvo que la relajación correspondiente se haya anunciado en R1.

describe("honestidad del top", () => {
  const OC = ["diario", "celebracion", "caminar"] as const;
  const TI = ["frio", "entretiempo", "calor"] as const;
  const TA = ["plano", "bajo", "tacon"] as const;
  it("sin relajación anunciada, ningún producto del top contradice color o tacón", () => {
    const fallos: string[] = [];
    for (const ocasion of OC)
      for (const tiempo of TI)
        for (const tacon of TA)
          for (const pref of COLORES) {
            const res = recomendar({ ocasion, tiempo, tacon, ...pref });
            const aceptados = tonosAceptados(pref);
            const caso = `${ocasion}/${tiempo}/${tacon}/${nombreColor(pref)}`;
            for (const p of res.top) {
              if (aceptados && p.color && !aceptados.has(p.color) && !res.relajaciones.includes("color"))
                fallos.push(`${caso}: ${p.nombre}`);
              if (p.tacon && p.tacon !== tacon && !res.relajaciones.includes("tacon"))
                fallos.push(`${caso}: ${p.nombre}`);
              const temporadaAnunciada = res.relajaciones.includes("estacion");
              if (!p.estaciones.includes(tiempo) && !temporadaAnunciada)
                fallos.push(`${caso}: ${p.nombre} fuera de temporada`);
              if (tiempo === "frio" && /SANDALIA|ALPARGATA/i.test(p.nombre))
                fallos.push(`${caso}: ${p.nombre} abierta con frío`);
            }
          }
    expect(fallos).toEqual([]);
  });
});
