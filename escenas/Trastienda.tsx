"use client";
/**
 * E — "Deme un momentito…" (diseno.md §2).
 * Don Pedro (pose trastienda), de pie en la tienda, dice sus dos frases de una en una mientras
 * calcula las recomendaciones y precarga las 6 fotos top. Saltable tocando o con "Saltar".
 * Después vuelve (pose señalando) y DICE lo que ha sacado (resumen R1, con la relajación honesta
 * si la hubo) y, breve, el pacto (talla y 14 días en casa: config.pacto). "Ver los zapatos" sale con
 * la última frase y abre la selección, que ya va sin diálogo (petición del usuario).
 * Si falla (lanza, top vacío o faltan respuestas): Don Pedro apurado lo dice, con "Ir a la tienda"
 * -> config.tiendaZapatosUrl, y track("error_catalogo").
 * Persuasión: anticipación (el bucle 1 está a punto de cerrarse) y coste hundido.
 */
import { useEffect, useRef, useState } from "react";
import { Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { PuntosEspera } from "@/components/quiz";
import { config } from "@/content/config";
import { personaje } from "@/content/personaje";
import { textos } from "@/content/textos";
import { useEstado } from "@/lib/estado";
import { track } from "@/lib/track";
import { urlTienda } from "@/lib/urls";
import { cargarRecomendador } from "@/lib/cargarRecomendador";
import { resumenRespuestas } from "@/lib/texto";

/** ok: con la frase de Don Pedro que resume sus respuestas (y la relajación honesta, si la hubo). */
type Resultado = { ok: true; frases: string[] } | { ok: false; motivo: string };

/** La última frase de la espera no necesita toda su lectura: los puntos ya marcan la pausa. */
const FIN_ESPERA_MS = 1800;

export default function Trastienda() {
  const { avanzar, retroceder, respuestasCompletas } = useEstado();
  const [error, setError] = useState(false);
  /** Tras la espera, Don Pedro dice lo que ha sacado; la selección sale después (petición del usuario). */
  const [dicho, setDicho] = useState<string[] | null>(null);
  /** "Ver los zapatos" sale cuando Don Pedro ha dicho también el pacto. */
  const [pactoDicho, setPactoDicho] = useState(false);
  const listo = useRef<Resultado | null>(null);
  const esperaDicha = useRef(false);
  const salido = useRef(false);
  const errorTrackeado = useRef(false);
  const cta = useRef<HTMLDivElement>(null);

  /** Fin de la espera (o saltarla): Don Pedro vuelve con los zapatos y lo dice. */
  const salir = () => {
    const r = listo.current;
    if (salido.current || !r?.ok) return;
    salido.current = true;
    setDicho(r.frases);
  };

  /** Pasa cuando Don Pedro ha dicho sus frases Y el recomendador (carga diferida) ha calculado. */
  const finEspera = () => {
    esperaDicha.current = true;
    salir();
  };

  useEffect(() => {
    let vivo = true;
    cargarRecomendador()
      .then((recomendar): Resultado => {
        if (!respuestasCompletas) throw new Error("respuestas incompletas");
        const r = recomendar(respuestasCompletas);
        if (!r || !Array.isArray(r.top) || r.top.length === 0) return { ok: false, motivo: "top vacío" };
        // Precarga de las 6 fotos top y de la pose del resultado.
        for (const p of r.top.slice(0, config.numRecomendaciones)) {
          const img = new Image();
          img.decoding = "async";
          img.src = p.imagen;
        }
        new Image().src = personaje.poses.senalando;
        const pacto = respuestasCompletas.ocasion === "casa" ? config.pacto.zapatillas : config.pacto.zapatos;
        return { ok: true, frases: [...resumenRespuestas(respuestasCompletas, r.relajaciones), ...pacto] };
      })
      .catch((e: unknown): Resultado => ({ ok: false, motivo: e instanceof Error ? e.message : "desconocido" }))
      .then((resultado) => {
        if (!vivo) return;
        listo.current = resultado;
        if (!resultado.ok) {
          setError(true);
          if (!errorTrackeado.current) {
            errorTrackeado.current = true;
            track("error_catalogo", { motivo: resultado.motivo });
          }
          return;
        }
        if (esperaDicha.current) salir();
      });
    return () => {
      vivo = false;
    };
    // Se calcula una sola vez al entrar en la trastienda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando Don Pedro ya lo ha dicho todo (o en error), el foco va al botón de abajo.
  useEffect(() => {
    if (pactoDicho || error) cta.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
  }, [pactoDicho, error]);

  if (error) {
    return (
      <EscenaTienda
        etiqueta={textos.trastienda.etiqueta}
        pose="apurado"
        arriba={
          <Boton variante="texto" anchoCompleto={false} onClick={retroceder} className="pastilla min-h-tactil">
            <span aria-hidden="true">←</span>
            {textos.quiz.atras}
          </Boton>
        }
        dialogo={<CuadroDialogo key="error" textos={textos.trastienda.error.burbujas} />}
        pie={
          <div ref={cta} className="w-full">
            <Boton href={urlTienda(config.tiendaZapatosUrl)} className="accion-destacada">
              {textos.trastienda.error.cta}
            </Boton>
          </div>
        }
      />
    );
  }

  if (dicho) {
    return (
      <EscenaTienda
        etiqueta={textos.trastienda.etiqueta}
        pose="senalando"
        dialogo={<CuadroDialogo key="dicho" textos={dicho} onCompleta={() => setPactoDicho(true)} />}
        pie={
          <div ref={cta} className="w-full">
            {pactoDicho ? (
              <Boton onClick={avanzar} className="accion-destacada">
                {respuestasCompletas?.ocasion === "casa" ? textos.trastienda.verZapatillas : textos.trastienda.verZapatos}
              </Boton>
            ) : null}
          </div>
        }
      />
    );
  }

  return (
    // Tocar en cualquier parte salta la espera; el botón "Saltar" da la misma opción con teclado.
    <div onClick={finEspera} className="cursor-pointer">
      <EscenaTienda
        etiqueta={textos.trastienda.etiqueta}
        pose="trastienda"
        arriba={
          <Boton
            variante="texto"
            anchoCompleto={false}
            onClick={(e) => {
              e.stopPropagation();
              finEspera();
            }}
            className="pastilla min-h-tactil"
            aria-label={textos.trastienda.etiquetaSaltar}
          >
            {textos.trastienda.saltar}
          </Boton>
        }
        dialogo={
          <>
            <CuadroDialogo key="espera" textos={textos.trastienda.burbujas} onFin={finEspera} finMs={FIN_ESPERA_MS} />
            <PuntosEspera className="pastilla mx-auto mt-3 w-fit py-2" />
          </>
        }
      />
    </div>
  );
}
