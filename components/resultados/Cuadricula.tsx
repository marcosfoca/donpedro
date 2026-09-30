"use client";
import type { CSSProperties } from "react";
import type { Producto } from "@/types";
import { TarjetaProducto } from "./TarjetaProducto";

type Props = {
  productos: Producto[];
  etiqueta: string;
};

/**
 * R2. Cuadrícula de 6 que, con el título "Recomendaciones" encima, ocupa TODA la pantalla (Don
 * Pedro ya lo ha dicho en la trastienda, petición del usuario).
 *
 * Alto de fila = max(--min-tarjeta, min(--max-tarjeta, (100dvh - holgura) / filas))
 * - Móvil: 3 filas, holgura 84px (título 52 + 8 arriba + 2 huecos de 8 + 8 abajo), mínimo 180px.
 * - ≥768px: 2 filas, holgura 110px (título 66 + 16 arriba + 12 de hueco + 16 abajo), mínimo 220px,
 *   máximo 460px.
 * La foto (flex-1, object-contain) absorbe la diferencia; etiqueta y precio son fijos.
 */
export function Cuadricula({ productos, etiqueta }: Props) {
  const estilo = {
    gridAutoRows:
      "max(var(--min-tarjeta), min(var(--max-tarjeta), calc((100dvh - var(--holgura)) / var(--filas))))",
  } as CSSProperties;

  return (
    <ul
      aria-label={etiqueta}
      style={estilo}
      className={[
        "mx-auto grid w-full max-w-resultados grid-cols-2 gap-[8px] px-4 pb-[8px] pt-[8px] md:pt-[16px]",
        "[--filas:3] [--holgura:84px] [--min-tarjeta:180px] [--max-tarjeta:9999px]",
        "md:grid-cols-3 md:gap-[12px] md:pb-[16px]",
        "md:[--filas:2] md:[--holgura:110px] md:[--min-tarjeta:220px] md:[--max-tarjeta:460px]",
      ].join(" ")}
    >
      {productos.map((p, i) => (
        <li key={`${p.id}-${p.idAtributo}`} className="min-h-0 min-w-0">
          <TarjetaProducto producto={p} posicion={i + 1} modo="ajustado" prioritaria />
        </li>
      ))}
    </ul>
  );
}
