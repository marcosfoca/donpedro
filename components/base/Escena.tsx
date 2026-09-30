import type { ReactNode } from "react";

export type FondoEscena = {
  movil: string;
  /** Versión horizontal (≥768px). Si falta, se usa la móvil. */
  escritorio?: string;
  /** "" si es decorativo (por defecto). La fachada lleva alt (textos.fachada.altFachada). */
  alt?: string;
  /** true solo en la escena LCP (fachada). */
  prioridad?: boolean;
  /** object-position CSS, p. ej. "center bottom". */
  posicion?: string;
};

export type EscenaProps = {
  /** Nombre accesible de la sección (p. ej. "Saludo"). */
  etiqueta: string;
  fondo?: FondoEscena;
  /** Capa para oscurecer/aclarar el fondo y mejorar la legibilidad. */
  velo?: "ninguno" | "claro" | "oscuro";
  /**
   * "pantalla": exactamente 100dvh sin scroll (F, T, E).
   * "minima": al menos 100dvh, crece con el contenido (S, Q, R).
   */
  alto?: "pantalla" | "minima";
  children?: ReactNode;
  className?: string;
  /** Clases del contenedor interior (layout del contenido). */
  claseContenido?: string;
};

/**
 * Envoltorio de cada escena: fondo ilustrado a pantalla completa (100dvh) y contenido encima.
 * Mobile first: el contenido va en una columna de ancho máximo 36rem salvo que claseContenido diga otra cosa.
 */
export function Escena({
  etiqueta,
  fondo,
  velo = "ninguno",
  alto = "minima",
  children,
  className = "",
  claseContenido = "mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-6 pt-16",
}: EscenaProps) {
  return (
    <section
      aria-label={etiqueta}
      className={`relative isolate w-full overflow-hidden ${alto === "pantalla" ? "h-pantalla" : "min-h-pantalla"} ${className}`}
    >
      {fondo ? (
        <picture className="absolute inset-0 -z-10">
          {fondo.escritorio ? <source media="(min-width: 768px)" srcSet={fondo.escritorio} /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fondo.movil}
            alt={fondo.alt ?? ""}
            aria-hidden={fondo.alt ? undefined : true}
            fetchPriority={fondo.prioridad ? "high" : undefined}
            loading={fondo.prioridad ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: fondo.posicion ?? "center" }}
          />
        </picture>
      ) : null}
      {velo !== "ninguno" ? (
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 ${velo === "claro" ? "bg-fondo/70" : "bg-tinta/40"}`}
        />
      ) : null}
      <div className={claseContenido}>{children}</div>
    </section>
  );
}
