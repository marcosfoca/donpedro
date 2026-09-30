"use client";
import { forwardRef, useState } from "react";
import { textos } from "@/content/textos";
import { etiquetaCorta, formatoPrecio, tipoOracion } from "@/lib/texto";
import { track } from "@/lib/track";
import { urlTienda } from "@/lib/urls";
import type { Producto } from "@/types";

type Props = {
  producto: Producto;
  /** Posición 1-based en el ranking mostrado (para comprar_click). */
  posicion: number;
  /**
   * "ajustado": la tarjeta llena el alto de su celda (cuadrícula R2, alto calculado sobre 100dvh);
   *   la foto ocupa el espacio que sobra.
   * "natural": foto cuadrada (aspect-square) y alto libre (R4).
   */
  modo: "ajustado" | "natural";
  /** Las 6 primeras se cargan sin lazy (diseno.md §5.4). */
  prioritaria?: boolean;
};

/**
 * Tarjeta de producto (R2 / R4). Es UN único <a> con aspecto de tarjeta: toda la tarjeta
 * lleva a la ficha real (misma pestaña). No hay botón "Comprar" visible (petición del usuario): la
 * tarjeta es el botón, con una flecha como pista y "Comprar" en su nombre accesible.
 */
export const TarjetaProducto = forwardRef<HTMLAnchorElement, Props>(function TarjetaProducto(
  { producto, posicion, modo, prioritaria = false },
  ref,
) {
  const nombre = tipoOracion(producto.nombre);
  const etiqueta = etiquetaCorta(producto);
  const [sinFoto, setSinFoto] = useState(false);
  const ajustado = modo === "ajustado";
  const hayAnterior =
    typeof producto.precioAnterior === "number" && producto.precioAnterior > producto.precio;

  return (
    <a
      ref={ref}
      href={urlTienda(producto.url)}
      onClick={() => track("comprar_click", { id: producto.id, precio: producto.precio, posicion })}
      className={[
        "group flex flex-col rounded-xl border-2 border-dorado bg-white text-tinta shadow-sm",
        "transition-shadow duration-200 ease-suave hover:shadow-md",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino",
        ajustado ? "h-full gap-[4px] p-[6px]" : "gap-[6px] p-[8px]",
      ].join(" ")}
    >
      {/* 1. Foto original: fondo blanco, object-contain */}
      <span
        className={[
          "relative block w-full overflow-hidden rounded-lg bg-white",
          ajustado ? "min-h-0 flex-1" : "aspect-square",
        ].join(" ")}
      >
        {sinFoto ? (
          <span className="absolute inset-0 flex items-center justify-center p-2 text-center font-serif text-[16px] italic text-gris">
            {textos.errores.imagenCorta}
            <span className="sr-only">. {nombre}</span>
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={nombre}
            width={600}
            height={600}
            loading={prioritaria ? "eager" : "lazy"}
            fetchPriority={prioritaria ? "high" : undefined}
            decoding="async"
            onError={() => setSinFoto(true)}
            // Las fotos de PrestaShop traen ~15 % de margen blanco por lado: se amplían sin recortar
            // el zapato (el contenedor tiene overflow-hidden).
            className="absolute inset-0 h-full w-full scale-[1.3] object-contain"
          />
        )}
        {/* Etiqueta corta en móvil (en escritorio ya se ve el nombre): "Salón · tacón bajo". */}
        {ajustado && etiqueta ? (
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 max-w-full truncate rounded-br-md bg-fondo/95 px-1.5 font-sans text-[15px] font-semibold leading-[22px] text-tinta md:hidden"
          >
            {etiqueta}
          </span>
        ) : null}
      </span>

      {/* 2. Nombre en tipo oración, máx. 2 líneas (1 en pantallas muy bajas, solo en R2) */}
      <span
        className={[
          "block overflow-hidden font-sans text-[16px] font-semibold leading-[20px] line-clamp-2",
          ajustado
            ? "hidden md:block md:h-[40px] md:shrink-0 md:line-clamp-2"
            : "min-h-[40px]",
        ].join(" ")}
      >
        {nombre}
      </span>

      {/* 3. Precio + flecha. Sin botón "Comprar": toda la tarjeta es el botón (petición del usuario).
          El nombre accesible del enlace termina en "Comprar" (sr-only) para anunciar la acción. */}
      <span className="flex shrink-0 items-center justify-between gap-2 leading-[24px]">
        <span className="flex min-w-0 flex-row flex-wrap items-baseline gap-x-2">
          {hayAnterior ? <span className="sr-only">{textos.resultados.precioActualAccesible}</span> : null}
          <span className="whitespace-nowrap font-sans text-precio font-bold text-cuero">
            {formatoPrecio(producto.precio)}
          </span>
          {hayAnterior ? (
            <s className="whitespace-nowrap font-sans text-[15px] leading-[18px] text-gris">
              <span className="sr-only">{textos.resultados.precioAnteriorAccesible} </span>
              {formatoPrecio(producto.precioAnterior as number)}
            </s>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cuero text-[18px] font-bold leading-none text-fondo transition-colors duration-200 ease-suave group-hover:bg-cuero-oscuro"
        >
          →
        </span>
        <span className="sr-only">{textos.resultados.comprar}</span>
      </span>
    </a>
  );
});
