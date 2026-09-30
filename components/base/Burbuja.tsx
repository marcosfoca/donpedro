"use client";
import type { ReactNode } from "react";

type BurbujaProps = {
  children: ReactNode;
  /**
   * Pico de la burbuja: hacia arriba (Don Pedro encima), a la izquierda (miniatura al lado) o
   * hacia abajo (cuadro de diálogo sobre Don Pedro, que está de pie en la tienda).
   */
  pico?: "arriba" | "abajo" | "izquierda" | "ninguno";
  /** Animación de aparición (se desactiva sola con prefers-reduced-motion vía CSS). */
  animar?: boolean;
  /** Clase de la animación de aparición (por defecto, animate-aparecer). */
  animacion?: string;
  className?: string;
};

/**
 * Una burbuja de Don Pedro (Vollkorn 20px). No lleva aria-live por sí sola: la usa
 * <CuadroDialogo>, que sí lo lleva y enseña las frases de una en una.
 */
export function Burbuja({
  children,
  pico = "arriba",
  animar = true,
  animacion = "animate-aparecer",
  className = "",
}: BurbujaProps) {
  const picoClase =
    pico === "arriba"
      ? "before:absolute before:-top-2 before:left-8 before:h-4 before:w-4 before:rotate-45 before:border-l-2 before:border-t-2 before:border-dorado before:bg-white before:content-['']"
      : pico === "abajo"
        ? "before:absolute before:-bottom-2 before:left-1/2 before:-ml-2 before:h-4 before:w-4 before:rotate-45 before:border-b-2 before:border-r-2 before:border-dorado before:bg-white before:content-['']"
        : pico === "izquierda"
          ? "before:absolute before:-left-2 before:top-5 before:h-4 before:w-4 before:rotate-45 before:border-b-2 before:border-l-2 before:border-dorado before:bg-white before:content-['']"
          : "";
  return (
    <div
      className={`relative rounded-2xl border-2 border-dorado bg-white px-5 py-3 font-serif text-burbuja text-tinta shadow-sm ${picoClase} ${animar ? animacion : ""} ${className}`}
    >
      {children}
    </div>
  );
}
