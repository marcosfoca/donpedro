import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type VarianteBoton = "primario" | "secundario" | "texto";
export type TamanoBoton = "normal" | "tarjeta";

type Comunes = {
  variante?: VarianteBoton;
  /** "normal": alto mín. 56px (defecto). "tarjeta": alto mín. 48px (botón Comprar). */
  tamano?: TamanoBoton;
  /** Ancho completo del contenedor (por defecto true). */
  anchoCompleto?: boolean;
  children: ReactNode;
  className?: string;
};

type ComoBoton = Comunes &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };
type ComoEnlace = Comunes &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };

export type BotonProps = ComoBoton | ComoEnlace;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 text-center font-sans font-bold " +
  "transition-colors duration-200 ease-suave select-none " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTES: Record<VarianteBoton, string> = {
  // #816040 + texto #FBF7EA negrita = 5,32:1 (AA)
  primario: "bg-cuero text-fondo shadow-md hover:bg-cuero-oscuro active:bg-cuero-oscuro",
  secundario:
    "border-2 border-cuero bg-fondo text-cuero-oscuro hover:bg-crema active:bg-crema",
  texto: "bg-transparent text-cuero-oscuro underline underline-offset-4 hover:text-tinta px-3",
};

const TAMANOS: Record<TamanoBoton, string> = {
  normal: "min-h-boton text-boton py-3",
  tarjeta: "min-h-boton-tarjeta text-boton py-2 px-3",
};

export function clasesBoton({
  variante = "primario",
  tamano = "normal",
  anchoCompleto = true,
  className = "",
}: Pick<Comunes, "variante" | "tamano" | "anchoCompleto" | "className">) {
  return [BASE, VARIANTES[variante], TAMANOS[tamano], anchoCompleto ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

/**
 * Botón grande sénior. Con `href` se renderiza como <a> (misma pestaña por defecto:
 * no abrir pestañas nuevas, diseno.md §2 R2).
 */
export function Boton(props: BotonProps) {
  const { variante, tamano, anchoCompleto, className, children, ...resto } = props;
  const clases = clasesBoton({ variante, tamano, anchoCompleto, className });
  if (typeof resto.href === "string") {
    const a = resto as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...a} className={clases}>
        {children}
      </a>
    );
  }
  const b = resto as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...b} className={clases}>
      {children}
    </button>
  );
}
