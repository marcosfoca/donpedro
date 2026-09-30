"use client";
/**
 * T — Entrar (diseno.md §2). 1,2 s: la hoja de la puerta se abre hacia dentro (rotateY con
 * perspectiva) y la cámara avanza hacia el interior (escala + fundido de la fachada).
 * Tocar en cualquier sitio (o pulsar una tecla) salta. Con prefers-reduced-motion: fundido de
 * 300 ms sin zoom. Al terminar, avanzar() a S. Solo Web Animations API, sin dependencias.
 */
import { useCallback, useEffect, useRef } from "react";
import { Escena } from "@/components/base";
import { CapaFachada, useEsEscritorio } from "@/components/fachada/CapaFachada";
import { assets } from "@/content/assets";
import { textos } from "@/content/textos";
import { useEstado } from "@/lib/estado";
import { useMomento } from "@/lib/momento";
import { prefiereMenosMovimiento } from "@/lib/movimiento";
import { movimiento } from "@/lib/tokens";

/** Coreografía (fracciones de movimiento.entradaMs). Ajustable sin tocar la lógica. */
const COREOGRAFIA = {
  aperturaHasta: 0.5, // la hoja termina de abrirse
  // grados. Bisagras a la DERECHA (el tirador está a la izquierda): con origen en el borde
  // derecho, un ángulo negativo aleja el borde libre (se abre hacia dentro).
  anguloHoja: -82,
  zoomFachada: 2.8, // escala final de la fachada (la cámara "entra" por la puerta)
  fundidoDesde: 0.45, // la fachada empieza a desvanecerse
  zoomInterior: 1.15, // el interior parte algo ampliado y se asienta en 1
};

export default function Entrada() {
  const { avanzar } = useEstado();
  const escritorio = useEsEscritorio();
  const momento = useMomento();
  // Entrada se monta tras la hidratación: el momento ya se conoce en el primer render.
  const puerta = assets.puerta[momento ?? "dia"][escritorio ? "escritorio" : "movil"];
  const capa = useRef<HTMLDivElement>(null);
  const hoja = useRef<HTMLImageElement>(null);
  const interior = useRef<HTMLImageElement>(null);
  const hecho = useRef(false);
  const animaciones = useRef<Animation[]>([]);

  const terminar = useCallback(() => {
    if (hecho.current) return;
    hecho.current = true;
    for (const a of animaciones.current) a.cancel();
    animaciones.current = [];
    avanzar();
  }, [avanzar]);

  useEffect(() => {
    const D = movimiento.entradaMs;
    const reducir = prefiereMenosMovimiento();
    const c = capa.current;
    const h = hoja.current;
    const i = interior.current;
    let reserva: number | undefined;

    const puedeAnimar = !!c && typeof c.animate === "function";
    if (!puedeAnimar) {
      reserva = window.setTimeout(terminar, reducir ? movimiento.fundidoReducidoMs : D);
      return () => window.clearTimeout(reserva);
    }

    const lista: Animation[] = [];
    let principal: Animation;
    if (reducir) {
      principal = c.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: movimiento.fundidoReducidoMs,
        easing: "ease-out",
        fill: "forwards",
      });
      lista.push(principal);
    } else {
      const C = COREOGRAFIA;
      if (h) {
        lista.push(
          h.animate(
            [{ transform: "rotateY(0deg)" }, { transform: `rotateY(${C.anguloHoja}deg)` }],
            { duration: D * C.aperturaHasta, easing: movimiento.easing, fill: "forwards" },
          ),
        );
      }
      principal = c.animate(
        [
          { transform: "scale(1)", opacity: 1, offset: 0 },
          { transform: "scale(1.08)", opacity: 1, offset: C.aperturaHasta * 0.6 },
          { opacity: 1, offset: C.fundidoDesde },
          { transform: `scale(${C.zoomFachada})`, opacity: 0, offset: 1 },
        ],
        { duration: D, easing: "cubic-bezier(0.55, 0, 0.35, 1)", fill: "forwards" },
      );
      lista.push(principal);
      if (i) {
        lista.push(
          i.animate(
            [{ transform: `scale(${C.zoomInterior})` }, { transform: "scale(1)" }],
            { duration: D, easing: movimiento.easing, fill: "forwards" },
          ),
        );
      }
    }
    animaciones.current = lista;
    principal.onfinish = () => terminar();
    // Red de seguridad por si la pestaña está en segundo plano y no llega onfinish.
    reserva = window.setTimeout(terminar, (reducir ? movimiento.fundidoReducidoMs : D) + 600);

    return () => {
      window.clearTimeout(reserva);
      principal.onfinish = null;
      for (const a of lista) a.cancel();
    };
  }, [terminar]);

  // Teclado: cualquier tecla de acción salta la entrada.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        terminar();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [terminar]);

  const fondoInterior = escritorio ? assets.interior.escritorio : assets.interior.movil;

  return (
    <Escena etiqueta={textos.entrada.etiqueta} alto="pantalla" claseContenido="absolute inset-0">
      {/* Destino: el interior (A3), ya precargado durante F. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={interior}
        src={fondoInterior}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />

      {/* La fachada con la puerta, que se abre y por la que "entra" la cámara. */}
      <CapaFachada
        alt=""
        refCapa={capa}
        origenEnPuerta
        className="will-change-transform"
        puerta={(estilo) => (
          <div style={{ ...estilo, perspective: "900px" }} aria-hidden="true">
            {/* Hueco de la puerta: se entrevé el interior al abrirse la hoja. */}
            <div
              className="absolute inset-0 rounded-t-md bg-tinta bg-cover bg-center"
              style={{ backgroundImage: `url(${fondoInterior})` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={hoja}
              src={puerta}
              alt=""
              className="absolute inset-0 h-full w-full object-fill will-change-transform"
              style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
            />
          </div>
        )}
      />

      {/* Tocar en cualquier sitio salta. Es un <button> real (teclado y lector de pantalla). */}
      <button
        type="button"
        onClick={terminar}
        aria-label={textos.entrada.etiquetaSaltar}
        className="group absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))] focus-visible:outline-none"
      >
        <span className="inline-flex min-h-tactil items-center rounded-full border-2 border-dorado bg-fondo/90 px-5 font-sans text-base font-bold text-tinta shadow-md group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-2 group-focus-visible:outline-marino">
          {textos.entrada.saltar}
        </span>
      </button>
    </Escena>
  );
}
