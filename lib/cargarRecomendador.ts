import type { Recomendar } from "@/types";

/**
 * El recomendador trae el catálogo entero (~300 kB de JSON). Se carga en diferido para no
 * pesar en la primera pantalla: se pide al montar el saludo y se espera en la trastienda.
 * Único punto de acceso al recomendador desde las escenas.
 */
let promesa: Promise<Recomendar> | null = null;

export function cargarRecomendador(): Promise<Recomendar> {
  promesa ??= import("@/lib/recomendador").then((m) => m.recomendar);
  return promesa;
}
