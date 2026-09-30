"use client";
/**
 * F — La fachada (diseno.md §2). Hero a 100dvh: título y subtítulo en el cielo, CTA "Abrir la
 * puerta" por encima del pliegue y la puerta ilustrada como segundo destino táctil.
 * Mientras se ve, se precarga el interior (A3) para que T y S aparezcan al instante (§5.6).
 */
import { useEffect, useRef } from "react";
import { Boton, Escena } from "@/components/base";
import { CapaFachada, useEsEscritorio } from "@/components/fachada/CapaFachada";
import { MEDIA_ESCRITORIO } from "@/components/fachada/geometria";
import { assets } from "@/content/assets";
import { personaje } from "@/content/personaje";
import { textos } from "@/content/textos";
import { useEstado } from "@/lib/estado";
import { useMomento } from "@/lib/momento";
import { precargarCampanilla, reproducirCampanilla } from "@/lib/sonido";
import { track } from "@/lib/track";

/** experiencia_vista: una sola vez por carga de página (también en StrictMode). */
let experienciaVistaEnviada = false;


export default function Fachada() {
  const { avanzar, hidratado, fase, sonido } = useEstado();
  const momento = useMomento();
  const escritorioActual = useEsEscritorio();
  // La hoja animada solo se pinta cuando se sabe si es de día o de noche (la fachada ya lleva
  // la puerta dibujada, así que antes no falta nada).
  const puerta = momento ? assets.puerta[momento][escritorioActual ? "escritorio" : "movil"] : null;
  const abierta = useRef(false);

  useEffect(() => {
    if (!hidratado || fase !== "fachada" || experienciaVistaEnviada) return;
    experienciaVistaEnviada = true;
    track("experiencia_vista");
  }, [hidratado, fase]);

  // Precarga del interior (la versión que tocará según el ancho), de la puerta y de Don Pedro saludando.
  useEffect(() => {
    const escritorio = window.matchMedia?.(MEDIA_ESCRITORIO).matches;
    const fuentes = [escritorio ? assets.interior.escritorio : assets.interior.movil, personaje.poses.saludo];
    if (puerta) fuentes.push(puerta);
    for (const src of fuentes) {
      const im = new Image();
      im.decoding = "async";
      im.src = src;
    }
  }, [puerta]);

  useEffect(() => {
    if (sonido) precargarCampanilla();
  }, [sonido]);

  const abrir = () => {
    if (abierta.current) return;
    abierta.current = true;
    track("puerta_abierta");
    void reproducirCampanilla(sonido);
    avanzar();
  };

  return (
    <Escena etiqueta={textos.fachada.titulo} alto="pantalla" claseContenido="absolute inset-0">
      <CapaFachada
        alt={textos.fachada.altFachada}
        puerta={(estilo) => (
          // Segundo destino táctil (hace lo mismo que el botón): fuera del orden de tabulación y del
          // árbol accesible para no duplicar la acción.
          <button
            type="button"
            onClick={abrir}
            tabIndex={-1}
            aria-hidden="true"
            style={estilo}
            className="group z-0 block min-h-tactil min-w-tactil cursor-pointer rounded-t-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-marino"
          >
            {puerta ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={puerta}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-fill transition-[filter] duration-200 ease-suave group-hover:brightness-110"
              />
            ) : null}
          </button>
        )}
      />

      {/* Velo del cielo (app/globals.css): claro de día, oscuro de noche, según <html data-momento>. */}
      <div aria-hidden="true" className="fachada-velo pointer-events-none absolute inset-x-0 top-0 h-[55%]" />

      {/* Título, promesa y botón viven en el cielo: la fachada (y su puerta) queda entera a la vista. */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-xl flex-col justify-between px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[68px] md:pt-20">
        <div className="flex flex-col items-center gap-4 [@media(max-height:700px)]:gap-2.5">
          {/* De día, tinta sobre el cielo dorado (~9:1); de noche, crema sobre azul marino. */}
          <header className="fachada-titulos text-center">
            <h1 className="font-serif text-titulo font-bold">{textos.fachada.titulo}</h1>
            <p className="mx-auto mt-2 max-w-md font-serif text-subtitulo [@media(max-height:700px)]:mt-1">{textos.fachada.subtitulo}</p>
          </header>
          <div className="pointer-events-auto w-full max-w-xs">
            <Boton onClick={abrir} className="shadow-lg">
              {textos.fachada.cta}
            </Boton>
          </div>
        </div>

        <p className="mx-auto rounded-full bg-fondo/90 px-3 py-0.5 text-center font-sans text-[15px] leading-[22px] text-tinta shadow-sm">
          {textos.fachada.direccion}
        </p>
      </div>
    </Escena>
  );
}
