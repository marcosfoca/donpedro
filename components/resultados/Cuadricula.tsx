"use client";
import type { Producto } from "@/types";
import { TarjetaProducto } from "./TarjetaProducto";

type Props = {
  productos: Producto[];
  etiqueta: string;
};

/**
 * R2. Cuadrícula de 6 que, con el título y la indicación encima, llena la pantalla: la rejilla
 * ocupa el alto que queda (flex-1) y lo reparte entre sus filas (3 en móvil, 2 desde 768 px), con
 * un mínimo por fila. Sin cálculos en px: si la persona tiene la letra grande, crece y se desplaza.
 */
export function Cuadricula({ productos, etiqueta }: Props) {
  return (
    <ul
      aria-label={etiqueta}
      className={[
        "mx-auto grid w-full max-w-resultados flex-1 grid-cols-2 gap-[8px] px-4 pb-[8px] pt-[8px] [[data-letra-grande]_&]:grid-cols-1",
        "auto-rows-[minmax(180px,1fr)] md:auto-rows-[minmax(220px,1fr)]",
        "md:grid-cols-3 md:gap-[12px] md:pb-[16px] md:pt-[12px]",
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
