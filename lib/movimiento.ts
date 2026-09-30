"use client";
import { useEffect, useState } from "react";

/** true si la clienta pide menos movimiento (prefers-reduced-motion: reduce). */
export function useMenosMovimiento(): boolean {
  const [reducir, setReducir] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducir(mq.matches);
    const cambio = (e: MediaQueryListEvent) => setReducir(e.matches);
    mq.addEventListener?.("change", cambio);
    return () => mq.removeEventListener?.("change", cambio);
  }, []);
  return reducir;
}

/** Lectura puntual (fuera de React, p. ej. en un manejador). */
export function prefiereMenosMovimiento(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}
