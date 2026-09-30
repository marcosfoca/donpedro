"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { assets } from "@/content/assets";
import { textos } from "@/content/textos";
import { TONOS_ELEGIBLES } from "@/lib/estado";
import type { Tono } from "@/types";

type MuestrasColorProps = {
  marcados: Tono[];
  onCambio: (tonos: Tono[]) => void;
  /** Se retiran (tras "Seguir") mientras Don Pedro vuelve a reaccionar. */
  saliendo?: boolean;
};

/**
 * Q4 → "Uno en concreto": 12 muestras de piel (3 × 4). Se puede marcar una o varias
 * (consejo 2026-09-30: "negro o marrón" es una respuesta muy habitual); "Seguir" está fuera.
 * Cada muestra es un <button aria-pressed> de más de 48 px.
 */
export function MuestrasColor({ marcados, onCambio, saliendo = false }: MuestrasColorProps) {
  // La cascada de entrada solo al aparecer (si no, desmarcar una muestra la haría "entrar" otra vez).
  const [entrando, setEntrando] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setEntrando(false), 1500);
    return () => window.clearTimeout(id);
  }, []);
  const alternar = (t: Tono) => {
    navigator.vibrate?.(10);
    onCambio(marcados.includes(t) ? marcados.filter((x) => x !== t) : [...marcados, t]);
  };
  return (
    <div
      role="group"
      aria-label={textos.colores.etiquetaGrupo}
      className={`grid grid-cols-3 gap-2 [[data-letra-grande]_&]:grid-cols-2 transition-[opacity,transform] duration-300 ease-suave ${saliendo ? "translate-y-2 opacity-0" : ""}`}
    >
      {TONOS_ELEGIBLES.map((t, i) => {
        const marcado = marcados.includes(t);
        return (
          <div key={t} className="relative" style={{ "--i": i * 0.5, "--giro": i % 2 ? "2deg" : "-2deg" } as CSSProperties}>
            <button
              type="button"
              aria-pressed={marcado}
              onClick={() => alternar(t)}
              className={[
                "flex h-full w-full flex-col items-center justify-start gap-1 rounded-2xl border-2 bg-white px-1 py-1.5 text-tinta shadow-sm",
                "transition-[transform,border-color,background-color] duration-200 ease-suave",
                entrando ? "opcion-entra" : "",
                "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino",
                marcado ? "opcion-elegida border-cuero bg-crema" : "border-dorado hover:border-cuero",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assets.muestras[t as Exclude<Tono, "otro">]}
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                className="opcion-icono h-11 w-11 rounded-full ring-1 ring-dorado"
              />
              <span className="text-center font-sans text-base font-bold leading-5">
                {textos.colores.tonos[t as Exclude<Tono, "otro">]}
              </span>
            </button>
            {marcado ? (
              <span
                aria-hidden="true"
                className="opcion-sello pointer-events-none absolute -right-1.5 -top-1.5 grid h-8 w-8 place-items-center rounded-full border-2 border-fondo bg-cuero text-base font-bold leading-none text-fondo shadow-md"
              >
                ✓
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
