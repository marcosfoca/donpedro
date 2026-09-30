"use client";
/**
 * S — El saludo (diseno.md §2).
 * Don Pedro (pose saludo) de pie en la tienda, delante del mostrador. Sus frases salen de una en
 * una en el cuadro de arriba (cada una tiene su momento); "Saltar" va a la última y "Empezamos"
 * aparece abajo, delante de sus zapatos, con una animación que llama la atención.
 * Persuasión: parasocial, autoridad diegética (1958, la casa, las nietas), refuerza el bucle 1.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { assets } from "@/content/assets";
import { personaje } from "@/content/personaje";
import { textos } from "@/content/textos";
import { useEstado } from "@/lib/estado";
import { cargarRecomendador } from "@/lib/cargarRecomendador";
import { saludoPorHora } from "@/lib/texto";
import { track } from "@/lib/track";

export default function Saludo() {
  const { avanzar } = useEstado();
  const frases = useMemo(() => textos.saludo.burbujas(saludoPorHora()), []);
  const [saltado, setSaltado] = useState(false);
  const [completo, setCompleto] = useState(false);
  const cta = useRef<HTMLDivElement>(null);
  const pulsado = useRef(false);

  // Mientras se lee el saludo: pose e iconos de Q1, y el recomendador (catálogo) en diferido.
  useEffect(() => {
    for (const src of [personaje.poses.escuchando, ...Object.values(assets.iconos.q1)]) {
      const img = new Image();
      img.src = src;
    }
    void cargarRecomendador();
  }, []);

  const alCompletar = useCallback(() => setCompleto(true), []);

  const saltar = () => {
    setSaltado(true);
    setCompleto(true);
  };

  // Si se ha saltado con teclado, que el foco no se pierda al desaparecer "Saltar".
  useEffect(() => {
    if (completo && saltado) cta.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [completo, saltado]);

  const empezar = () => {
    if (pulsado.current) return;
    pulsado.current = true;
    track("saludo_completado");
    avanzar();
  };

  return (
    <EscenaTienda
      etiqueta={textos.saludo.etiqueta}
      pose="saludo"
      arriba={
        !completo ? (
          <Boton
            variante="texto"
            anchoCompleto={false}
            onClick={saltar}
            className="pastilla min-h-tactil"
            aria-label={textos.saludo.etiquetaSaltar}
          >
            {textos.saludo.saltar}
          </Boton>
        ) : null
      }
      dialogo={<CuadroDialogo textos={frases} mostrarTodas={saltado} onCompleta={alCompletar} />}
      pie={
        <div ref={cta} className="w-full">
          {completo ? (
            <Boton onClick={empezar} className="accion-destacada">
              {textos.saludo.cta}
            </Boton>
          ) : null}
        </div>
      }
    />
  );
}
