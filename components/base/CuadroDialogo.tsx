"use client";
import { useEffect, useRef, useState } from "react";
import { personaje } from "@/content/personaje";
import { textos as contenido } from "@/content/textos";
import { Burbuja } from "./Burbuja";

type CuadroDialogoProps = {
  /** Frases de Don Pedro: se muestran de UNA en una en el mismo cuadro. */
  textos: string[];
  /** Salta a la última frase (p. ej. botón "Saltar"). */
  mostrarTodas?: boolean;
  /** Se llama una vez cuando se muestra la última frase (p. ej. para enseñar el botón). */
  onCompleta?: () => void;
  /**
   * Si existe, la última frase también espera un toque, y al tocar se llama (una vez): es el paso
   * a lo siguiente (opciones, otra escena…). Sin onFin, la última frase se queda y lo siguiente
   * es el botón que aparece con onCompleta.
   */
  onFin?: () => void;
  /** Se llama cada vez que cambia la frase (índice), p. ej. para cambiar la pose. */
  onFrase?: (i: number) => void;
  /** Pico hacia Don Pedro (debajo, de pie en la tienda) o sin pico (cuando no está). */
  pico?: "abajo" | "ninguno";
  className?: string;
};

/**
 * Toques para avanzar que ya ha dado la clienta en esta visita. Las primeras veces la pista es muy
 * visible ("Toque para seguir"); cuando ya lo ha entendido, basta la flecha.
 */
const PISTAS_EVIDENTES = 3;
let toquesDados = 0;
const CLAVE_TOQUES = "donpedro:toques:v1";
function leerToques(): number {
  try {
    return Number(sessionStorage.getItem(CLAVE_TOQUES)) || toquesDados;
  } catch {
    return toquesDados;
  }
}
function sumarToque() {
  toquesDados = leerToques() + 1;
  try {
    sessionStorage.setItem(CLAVE_TOQUES, String(toquesDados));
  } catch {
    // sin sessionStorage basta con la variable
  }
}

/**
 * Cuadro de diálogo único (estilo novela visual, petición del usuario): cada frase tiene su momento
 * y avanza AL TOCAR, al ritmo de cada clienta (unas leen más rápido que otras). Se puede tocar el
 * cuadro o cualquier punto de la pantalla. Las primeras veces se señala muy claramente.
 * Va arriba, con el pico hacia Don Pedro, que está de pie en la tienda.
 * Para otra conversación, móntese con otra `key`.
 */
export function CuadroDialogo({
  textos,
  mostrarTodas = false,
  onCompleta,
  onFin,
  onFrase,
  pico = "abajo",
  className = "",
}: CuadroDialogoProps) {
  const [i, setI] = useState(0);
  const ultimo = textos.length - 1;
  const actual = mostrarTodas ? ultimo : Math.min(i, ultimo);
  const cb = useRef({ onCompleta, onFin, onFrase });
  cb.current = { onCompleta, onFin, onFrase };
  const [terminado, setTerminado] = useState(false);
  const [evidente, setEvidente] = useState(true);
  /** Las dependencias usan el texto, no el array (los componentes lo crean en cada render). */
  const clave = textos.join("\u0000");

  useEffect(() => setEvidente(leerToques() < PISTAS_EVIDENTES), []);

  useEffect(() => {
    cb.current.onFrase?.(actual);
    if (actual >= ultimo) cb.current.onCompleta?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, ultimo, clave]);

  const quedaAlgo = actual < ultimo || (!!onFin && !terminado);

  const tocar = () => {
    if (!quedaAlgo) return;
    sumarToque();
    setEvidente(leerToques() < PISTAS_EVIDENTES);
    if (actual < ultimo) {
      setI((n) => Math.min(n + 1, ultimo));
      return;
    }
    setTerminado(true);
    cb.current.onFin?.();
  };

  return (
    <div aria-live="polite" className={className}>
      {/* Tocar en cualquier parte también avanza (por debajo de los botones de la escena). */}
      {quedaAlgo ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={tocar}
          className="fixed inset-0 z-30 cursor-pointer bg-transparent"
        />
      ) : null}
      <span className="sr-only">{contenido.accesible.personajeDice(personaje.nombre)}</span>
      <button type="button" onClick={tocar} className="relative z-40 block w-full text-left">
        <Burbuja key={`${actual}-${textos[actual]}`} pico={pico} animacion="animate-dialogo" className="origin-bottom">
          {textos[actual]}
          {quedaAlgo && !evidente ? (
            <span aria-hidden="true" className="ml-2 inline-block animate-pista font-bold text-cuero">
              ›
            </span>
          ) : null}
          {quedaAlgo && evidente ? (
            <span className="mt-2 flex w-fit animate-pista items-center gap-1.5 rounded-full bg-cuero px-3 py-1 font-sans text-base font-bold text-fondo shadow-md">
              {contenido.quiz.tocarParaSeguir}
              <span aria-hidden="true" className="text-[20px] leading-none">
                ›
              </span>
            </span>
          ) : quedaAlgo ? (
            <span className="sr-only">{contenido.quiz.tocarParaSeguir}</span>
          ) : null}
        </Burbuja>
      </button>
    </div>
  );
}
