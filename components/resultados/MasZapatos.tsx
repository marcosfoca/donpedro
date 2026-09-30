"use client";
import { config } from "@/content/config";
import { textos } from "@/content/textos";
import type { Producto } from "@/types";
import { TarjetaProducto } from "./TarjetaProducto";

type Props = {
  /** resultado.mas (siguientes del mismo ranking). */
  mas: Producto[];
  /** Posición del primero de `mas` en el ranking global (tras las 6 de R2). */
  posicionInicial: number;
};

/**
 * R4. "Más zapatos para usted": todos a la vista (hasta config.maxMasZapatos), para seguir
 * bajando. Sin botón de tandas: en la página solo hay un botón, "Ver toda la tienda" (petición
 * del usuario, 2026-09-30).
 */
export function MasZapatos({ mas, posicionInicial }: Props) {
  const disponibles = mas.slice(0, config.maxMasZapatos);
  if (disponibles.length === 0) return null;
  return (
    <section aria-labelledby="mas-titulo" className="mx-auto w-full max-w-resultados px-4 pb-6 pt-8">
      <h2 id="mas-titulo" className="text-center font-serif text-subtitulo font-bold text-tinta">
        {textos.resultados.masTitulo}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-[8px] md:grid-cols-3 md:gap-[12px]">
        {disponibles.map((p, i) => (
          <li key={`${p.id}-${p.idAtributo}-${i}`} className="min-w-0">
            <TarjetaProducto producto={p} posicion={posicionInicial + i} modo="natural" />
          </li>
        ))}
      </ul>
    </section>
  );
}
