"use client";
import { useEffect, useRef, useState } from "react";
import { personaje } from "@/content/personaje";
import { textos as contenido } from "@/content/textos";
import { lectura } from "@/lib/tokens";
import { Burbuja } from "./Burbuja";

type CuadroDialogoProps = {
  /** Frases de Don Pedro: se muestran de UNA en una en el mismo cuadro. */
  textos: string[];
  /** Salta a la última frase (p. ej. botón "Saltar"). */
  mostrarTodas?: boolean;
  /** Se llama una vez cuando se muestra la última frase. */
  onCompleta?: () => void;
  /**
   * Se llama una vez cuando la última frase ya se ha leído (su tiempo de lectura, o tocar el
   * cuadro): es el momento de dar paso a lo siguiente (opciones, otra escena…).
   */
  onFin?: () => void;
  /** Tiempo de lectura de la última frase antes de onFin (por defecto, el de cualquier frase). */
  finMs?: number;
  /** Se llama cada vez que cambia la frase (índice), p. ej. para cambiar la pose. */
  onFrase?: (i: number) => void;
  /** Pico hacia Don Pedro (debajo, de pie en la tienda) o sin pico (cuando no está). */
  pico?: "abajo" | "ninguno";
  className?: string;
};

/**
 * Cuadro de diálogo único (estilo novela visual, petición del usuario): cada frase tiene su momento.
 * Va arriba, con el pico hacia Don Pedro, que está de pie en la tienda. Avanza solo con tiempo de
 * lectura suficiente; tocar el cuadro adelanta (y en la última frase, termina).
 * Para otra conversación, móntese con otra `key` (onFin se avisa una sola vez por montaje).
 */
export function CuadroDialogo({
  textos,
  mostrarTodas = false,
  onCompleta,
  onFin,
  finMs,
  onFrase,
  pico = "abajo",
  className = "",
}: CuadroDialogoProps) {
  const [i, setI] = useState(0);
  const ultimo = textos.length - 1;
  const actual = mostrarTodas ? ultimo : Math.min(i, ultimo);
  const cb = useRef({ onCompleta, onFin, onFrase });
  cb.current = { onCompleta, onFin, onFrase };
  const terminado = useRef(false);
  /** Las dependencias usan el texto, no el array (los componentes lo crean en cada render). */
  const clave = textos.join("\u0000");
  const frases = useRef(textos);
  frases.current = textos;

  const terminar = () => {
    if (terminado.current) return;
    terminado.current = true;
    cb.current.onFin?.();
  };

  useEffect(() => {
    cb.current.onFrase?.(actual);
    const t = frases.current[actual] ?? "";
    if (actual >= ultimo) {
      cb.current.onCompleta?.();
      const id = window.setTimeout(terminar, finMs ?? lectura(t));
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setI((n) => Math.min(n + 1, ultimo)), lectura(t));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, ultimo, clave, finMs]);

  const tocar = () => {
    if (actual < ultimo) setI((n) => Math.min(n + 1, ultimo));
    else terminar();
  };

  return (
    <div aria-live="polite" className={className}>
      <span className="sr-only">{contenido.accesible.personajeDice(personaje.nombre)}</span>
      <button
        type="button"
        onClick={tocar}
        className="block w-full text-left"
        aria-label={actual < ultimo ? contenido.quiz.tocarParaSeguir : undefined}
      >
        <Burbuja key={`${actual}-${textos[actual]}`} pico={pico} animacion="animate-dialogo" className="origin-bottom">
          {textos[actual]}
          {actual < ultimo ? (
            <span aria-hidden="true" className="ml-2 text-cuero">›</span>
          ) : null}
        </Burbuja>
      </button>
    </div>
  );
}
