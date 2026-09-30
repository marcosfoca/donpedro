"use client";
import type { ButtonHTMLAttributes } from "react";

export type TarjetaOpcionProps = {
  /** Ruta de la ilustración (content/assets.ts). Decorativa: alt="". */
  imagen: string;
  texto: string;
  subtexto?: string;
  seleccionada?: boolean;
  onClick?: () => void;
  /** "vertical": imagen arriba (rejilla 2×2). "horizontal": imagen a la izquierda (lista). */
  disposicion?: "vertical" | "horizontal";
  className?: string;
  /** Clase extra de la ilustración (p. ej. su animación de aparición). */
  claseImagen?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "children">;

/**
 * Opción del quiz: <button aria-pressed> con imagen, texto y subtexto opcional.
 * Zona táctil muy por encima de 48×48.
 */
export function TarjetaOpcion({
  imagen,
  texto,
  subtexto,
  seleccionada = false,
  onClick,
  disposicion = "vertical",
  className = "",
  claseImagen = "",
  ...resto
}: TarjetaOpcionProps) {
  const vertical = disposicion === "vertical";
  return (
    <button
      type="button"
      aria-pressed={seleccionada}
      onClick={onClick}
      {...resto}
      className={[
        "group flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3 text-tinta shadow-sm",
        "transition-[transform,border-color,background-color] duration-200 ease-suave",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino",
        "active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-not-allowed",
        vertical ? "min-h-[150px] flex-col justify-center text-center" : "min-h-[88px] flex-row text-left",
        seleccionada ? "border-cuero bg-crema" : "border-dorado hover:border-cuero",
        className,
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagen}
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className={`${vertical ? "h-[72px] w-[72px] object-contain sm:h-24 sm:w-24" : "h-16 w-16 shrink-0 object-contain"} ${claseImagen}`}
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-sans text-base font-bold leading-snug">{texto}</span>
        {subtexto ? <span className="font-sans text-base text-gris">{subtexto}</span> : null}
      </span>
    </button>
  );
}
