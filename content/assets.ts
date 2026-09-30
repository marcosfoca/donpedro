/**
 * Rutas de todos los assets de diseno.md §6 (salvo Don Pedro, que va en content/personaje.ts).
 * Todo es arte final (fuentes en arte/aprobado, ver arte/biblia.md). Fachada y puerta tienen
 * versión de día y de noche según la hora (lib/momento.ts).
 */
import type { ColorPreferido, Ocasion, Tacon, Tiempo, Tono } from "@/types";

export const assets = {
  // A1. Móvil 9:16 (768×1376) y escritorio 16:9 (1376×768); noche alineada al píxel con el día.
  fachada: {
    dia: { movil: "/arte/fachada/fachada-dia-movil.webp", escritorio: "/arte/fachada/fachada-dia-escritorio.webp" },
    noche: { movil: "/arte/fachada/fachada-noche-movil.webp", escritorio: "/arte/fachada/fachada-noche-escritorio.webp" },
  },
  // A2. Hoja de la puerta recortada de cada fachada (mismo píxel que en A1).
  puerta: {
    dia: { movil: "/arte/fachada/puerta-dia-movil.webp", escritorio: "/arte/fachada/puerta-dia-escritorio.webp" },
    noche: { movil: "/arte/fachada/puerta-noche-movil.webp", escritorio: "/arte/fachada/puerta-noche-escritorio.webp" },
  },
  interior: { movil: "/arte/interior-movil.webp", escritorio: "/arte/interior-escritorio.webp" }, // A3
  iconos: {
    q1: {
      diario: "/arte/iconos/q1-diario.webp",
      celebracion: "/arte/iconos/q1-celebracion.webp",
      caminar: "/arte/iconos/q1-caminar.webp",
      casa: "/arte/iconos/q1-casa.webp",
    } satisfies Record<Ocasion, string>, // A9
    q2: {
      frio: "/arte/iconos/q2-frio.webp",
      entretiempo: "/arte/iconos/q2-entretiempo.webp",
      calor: "/arte/iconos/q2-calor.webp",
    } satisfies Record<Tiempo, string>, // A10
    q3: {
      plano: "/arte/iconos/q3-plano.webp",
      bajo: "/arte/iconos/q3-bajo.webp",
      tacon: "/arte/iconos/q3-tacon.webp",
    } satisfies Record<Tacon, string>, // A11
    q4: {
      discretos: "/arte/iconos/q4-discretos.webp", // scripts/arte/muestras.py
      llamativos: "/arte/iconos/q4-color.webp",
      todos: "/arte/iconos/q4-todos.webp",
      concreto: "/arte/iconos/q4-concreto.webp", // scripts/arte/muestras.py
    } satisfies Record<ColorPreferido, string>, // A12
  },
  // Muestras de piel de Q4 "Uno en concreto" (scripts/arte/muestras.py, grano de las muestras aprobadas).
  muestras: {
    negro: "/arte/muestras/negro.webp",
    marron: "/arte/muestras/marron.webp",
    beige: "/arte/muestras/beige.webp",
    blanco: "/arte/muestras/blanco.webp",
    gris: "/arte/muestras/gris.webp",
    marino: "/arte/muestras/marino.webp",
    burdeos: "/arte/muestras/burdeos.webp",
    azul: "/arte/muestras/azul.webp",
    rojo: "/arte/muestras/rojo.webp",
    rosa: "/arte/muestras/rosa.webp",
    verde: "/arte/muestras/verde.webp",
    metal: "/arte/muestras/metal.webp",
  } satisfies Record<Exclude<Tono, "otro">, string>,
  // A13: el marco de reseñas se dibuja con CSS (components/resultados/Resenas.tsx).
  progreso: { vacio: "/arte/progreso-vacio.webp", lleno: "/arte/progreso-lleno.webp" }, // A14
  // A15: campanilla sintetizada por nosotros (scripts/arte/campanilla.py), sin muestras de terceros.
  sonido: { campanilla: "/sonido/campanilla.wav" },
} as const;
