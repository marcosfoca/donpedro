"use client";
import type { CSSProperties } from "react";
import { TarjetaOpcion, type TarjetaOpcionProps } from "@/components/base";

/**
 * "entrando": sale con rebote en cascada (y brillo) · "elegida": se encoge, rebota, anillo dorado,
 * sello y chispas · "descartada": se aparta mientras Don Pedro reacciona.
 */
export type EstadoOpcion = "entrando" | "elegida" | "descartada";

type OpcionProps = TarjetaOpcionProps & {
  /** Orden en la cascada de aparición. */
  indice: number;
  estado: EstadoOpcion;
};

/** Chispas de la elección: ángulo, distancia y color (dorado, cuero o marino, los de la casa). */
const CHISPAS = Array.from({ length: 12 }, (_, n) => ({
  a: `${n * 30 + (n % 2 ? 12 : 0)}deg`,
  d: `${78 + ((n * 37) % 5) * 12}px`,
  color: ["bg-dorado", "bg-cuero", "bg-dorado", "bg-marino"][n % 4],
}));

/** Tarjeta del quiz con el efecto "wow" de aparición y de elección (clases en app/globals.css). */
export function Opcion({ indice, estado, className = "", ...tarjeta }: OpcionProps) {
  const estilo = { "--i": indice, "--giro": indice % 2 ? "2.5deg" : "-2.5deg" } as CSSProperties;
  return (
    <div className={`relative ${estado === "elegida" ? "z-10" : ""}`} style={estilo}>
      <TarjetaOpcion
        {...tarjeta}
        claseImagen="opcion-icono"
        className={[
          "relative overflow-hidden",
          estado === "entrando" ? "opcion-entra opcion-brillo" : "",
          estado === "elegida" ? "opcion-elegida" : "",
          estado === "descartada" ? "opcion-descartada" : "",
          className,
        ].join(" ")}
      />
      {estado === "elegida" ? (
        <>
          <span
            aria-hidden="true"
            className="opcion-sello absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-full border-2 border-fondo bg-cuero text-[22px] font-bold leading-none text-fondo shadow-md"
          >
            ✓
          </span>
          {CHISPAS.map((c, n) => (
            <span
              key={n}
              aria-hidden="true"
              className={`opcion-chispa ${c.color}`}
              style={{ "--a": c.a, "--d": c.d, "--n": n } as CSSProperties}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
