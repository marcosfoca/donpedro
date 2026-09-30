"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { assets } from "@/content/assets";
import {
  ENCUADRE,
  MEDIA_ESCRITORIO,
  posicionCss,
  zonaEnPantalla,
  type Encuadre,
  type Rect,
} from "./geometria";

/** true en escritorio (mismo corte que la <source> de la fachada). */
export function useEsEscritorio(): boolean {
  const [escritorio, setEscritorio] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(MEDIA_ESCRITORIO);
    setEscritorio(mq.matches);
    const cambio = (e: MediaQueryListEvent) => setEscritorio(e.matches);
    mq.addEventListener?.("change", cambio);
    return () => mq.removeEventListener?.("change", cambio);
  }, []);
  return escritorio;
}

type CapaFachadaProps = {
  /** Alt de la fachada ("" si es decorativa, p. ej. durante la transición). */
  alt: string;
  /** Pinta la puerta: recibe el estilo absoluto que la coloca sobre la puerta dibujada. */
  puerta: (estilo: CSSProperties) => ReactNode;
  /** Pone el transform-origin de la capa en el centro de la puerta (zoom de la transición). */
  origenEnPuerta?: boolean;
  refCapa?: Ref<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
};

/**
 * Fondo de la fachada (A1) a pantalla completa con object-fit: cover y la puerta (A2) superpuesta
 * exactamente encima de la puerta dibujada (ver geometria.ts). La comparten F y T para que el
 * paso de una a otra sea continuo.
 */
export function CapaFachada({
  alt,
  puerta,
  origenEnPuerta = false,
  refCapa,
  className = "",
  children,
}: CapaFachadaProps) {
  const escritorio = useEsEscritorio();
  const encuadre: Encuadre = escritorio ? ENCUADRE.escritorio : ENCUADRE.movil;
  const contenedor = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  const medir = useCallback(() => {
    const c = contenedor.current;
    if (!c) return;
    const ancho = c.clientWidth;
    // La ilustración ocupa (1 + alturaExtra) × el alto del contenedor, anclada arriba.
    const alto = c.clientHeight * (1 + encuadre.alturaExtra);
    if (!ancho || !alto) return;
    // Proporción conocida del arte (arte/aprobado): no hace falta esperar a que cargue.
    setRect(zonaEnPantalla({ ancho, alto }, { ancho: encuadre.proporcion * 1000, alto: 1000 }, encuadre));
  }, [encuadre]);

  useEffect(() => {
    medir();
    const c = contenedor.current;
    let ro: ResizeObserver | null = null;
    if (c && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(medir);
      ro.observe(c);
    } else {
      window.addEventListener("resize", medir);
    }
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [medir]);

  // Hasta medir (SSR y primer pintado) se usa la zona como % de la pantalla: aproximado pero usable.
  const z = encuadre.puerta;
  const estiloPuerta: CSSProperties = rect
    ? { position: "absolute", left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : {
        position: "absolute",
        left: `${z.x * 100}%`,
        top: `${z.y * (1 + encuadre.alturaExtra) * 100}%`,
        width: `${z.ancho * 100}%`,
        height: `${z.alto * (1 + encuadre.alturaExtra) * 100}%`,
      };

  const origen =
    origenEnPuerta && rect
      ? `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`
      : origenEnPuerta
        ? `${(z.x + z.ancho / 2) * 100}% ${(z.y + z.alto / 2) * (1 + encuadre.alturaExtra) * 100}%`
        : undefined;

  return (
    <div
      ref={(nodo) => {
        contenedor.current = nodo;
        if (typeof refCapa === "function") refCapa(nodo);
        else if (refCapa) (refCapa as { current: HTMLDivElement | null }).current = nodo;
      }}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ transformOrigin: origen }}
    >
      {/*
        Fondo por CSS (app/globals.css, .fachada-fondo): según <html data-momento> y el ancho, el
        navegador descarga SOLO la fachada que toca (día o noche, móvil o escritorio). Con un <img>
        el HTML estático pedía siempre la de día y de noche se veían las dos.
      */}
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className="fachada-fondo absolute inset-x-0 top-0 block bg-cover bg-no-repeat"
        style={
          {
            height: `${(1 + encuadre.alturaExtra) * 100}%`,
            backgroundPosition: posicionCss(encuadre),
            "--fachada-dia-movil": `url(${assets.fachada.dia.movil})`,
            "--fachada-noche-movil": `url(${assets.fachada.noche.movil})`,
            "--fachada-dia-escritorio": `url(${assets.fachada.dia.escritorio})`,
            "--fachada-noche-escritorio": `url(${assets.fachada.noche.escritorio})`,
          } as CSSProperties
        }
      />
      {puerta(estiloPuerta)}
      {children}
    </div>
  );
}
