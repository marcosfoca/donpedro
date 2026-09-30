"use client";
import { textos } from "@/content/textos";
import { useEstado } from "@/lib/estado";

/**
 * Botón de sonido siempre visible (esquina superior derecha, 48px, texto "Sonido").
 * Ya lo monta app/page.tsx: las escenas NO deben renderizarlo.
 */
export function BotonSonido({ className = "" }: { className?: string }) {
  const { sonido, alternarSonido } = useEstado();
  return (
    <button
      type="button"
      aria-pressed={sonido}
      onClick={() => alternarSonido()}
      className={[
        "fixed right-3 top-3 z-50 inline-flex min-h-tactil min-w-tactil items-center gap-1.5 rounded-full",
        "border-2 border-dorado bg-fondo/95 px-3 font-sans text-base font-bold text-tinta shadow-md backdrop-blur",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino",
        className,
      ].join(" ")}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {sonido ? (
          <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
        ) : (
          <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />
        )}
      </svg>
      <span>{textos.sonido.etiqueta}</span>
    </button>
  );
}
