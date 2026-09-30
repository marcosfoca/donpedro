"use client";
import { useSyncExternalStore } from "react";
import { esDeNoche } from "@/lib/texto";

export type Momento = "dia" | "noche";

/**
 * Atributo que fija el script en línea de app/layout.tsx ANTES de pintar (`<html data-momento>`),
 * para que la fachada correcta sea la única que se descarga. Mismo corte que "Buenas noches".
 */
export const ATRIBUTO_MOMENTO = "momento";

function leer(): Momento {
  const fijado = document.documentElement.dataset[ATRIBUTO_MOMENTO];
  if (fijado === "dia" || fijado === "noche") return fijado;
  return esDeNoche(new Date()) ? "noche" : "dia";
}

const sinSuscripcion = () => () => {};

/**
 * "dia" o "noche" según la hora local. Devuelve null durante el render estático y la hidratación
 * (no hay hora en el servidor); las escenas montadas después lo tienen desde el primer render.
 */
export function useMomento(): Momento | null {
  return useSyncExternalStore(sinSuscripcion, leer, () => null);
}
