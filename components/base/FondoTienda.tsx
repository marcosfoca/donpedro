import { assets } from "@/content/assets";

/**
 * Interior de la tienda (A3) fijo detrás de TODAS las escenas de dentro (saludo, preguntas,
 * trastienda y resultados). Se monta una sola vez en app/page.tsx y no se desmonta al cambiar de
 * escena: antes cada escena traía su propio fondo y, al cambiar (justo cuando cambia la pose de Don
 * Pedro), había uno o dos fotogramas en blanco mientras se volvía a pintar (petición del usuario).
 * En resultados se opaca con un velo crema al 70 % que entra con un fundido.
 */
export function FondoTienda({ opacado = false }: { opacado?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <picture className="absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet={assets.interior.escritorio} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.interior.movil}
          alt=""
          loading="eager"
          decoding="sync"
          className="h-full w-full object-cover"
        />
      </picture>
      <div
        className={`absolute inset-0 bg-fondo/70 transition-opacity duration-300 ease-suave ${opacado ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
