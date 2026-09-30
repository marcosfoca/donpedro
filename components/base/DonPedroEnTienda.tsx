import { personaje, type Pose } from "@/content/personaje";

type DonPedroEnTiendaProps = {
  pose: Pose;
  /** false: se retira (fundido corto) para dejar sitio a las opciones; vuelve para reaccionar. */
  presente?: boolean;
  className?: string;
};

/**
 * Don Pedro de cuerpo entero, DE PIE EN EL SUELO de la tienda, delante del mostrador (petición del
 * usuario: que parezca una situación real, no que flote detrás del diálogo). Se pinta detrás del
 * contenido de la escena: el cuadro de diálogo va arriba, con el pico hacia él, y el botón abajo,
 * delante de sus zapatos.
 *
 * Geometría (arte/aprobado/interior-*.png): el suelo empieza al ~75 % del alto (pie del mostrador).
 * Los pies quedan a 84 px del borde inferior (sitio para un botón) y la figura mide 54dvh, algo más
 * del doble del mostrador, porque está delante de él. Úsese dentro de un contenedor `relative` con
 * el alto de la pantalla (Escena alto="pantalla").
 */
export function DonPedroEnTienda({ pose, presente = true, className = "" }: DonPedroEnTiendaProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-x-0 bottom-[4.667rem] flex h-[54dvh] justify-center",
        "transition-[opacity,transform] duration-300 ease-suave",
        presente ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      ].join(" ")}
    >
      {/* Sombra en el suelo: lo "posa" sobre las baldosas. */}
      <span className="absolute bottom-[-7px] left-1/2 h-4 w-[calc(54dvh*0.34)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(43,33,24,0.38),rgba(43,33,24,0))]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={personaje.poses[pose]}
        alt=""
        width={480}
        height={1000}
        loading="eager"
        decoding="sync"
        className="relative h-full w-auto object-contain object-bottom"
      />
    </div>
  );
}
