"use client";
/**
 * R — Las recomendaciones (petición del usuario, 2026-09-30). Don Pedro ya lo ha dicho en la
 * trastienda; aquí salen SOLO los zapatos, con el interior de la tienda opacado detrás:
 *   "Recomendaciones" (título) → las 6 → más zapatos para usted → un solo botón "Ver toda la tienda".
 * Sin reseñas, pacto ni despedida. El pie legal lo pone app/layout.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { Cuadricula, MasZapatos } from "@/components/resultados";
import { assets } from "@/content/assets";
import { config } from "@/content/config";
import { textos } from "@/content/textos";
import { cargarRecomendador } from "@/lib/cargarRecomendador";
import { useEstado } from "@/lib/estado";
import { resumenRespuestas } from "@/lib/texto";
import { track } from "@/lib/track";
import { urlTienda } from "@/lib/urls";
import type { Respuestas, ResultadoRecomendacion } from "@/types";

const ETIQUETA = textos.resultados.etiqueta;

/** Clave para no repetir `recomendaciones_vistas` al recargar la misma página de resultados. */
const CLAVE_VISTAS = "donpedro:vistas:v1";
/** Posición de scroll al salir hacia una ficha de la tienda, para devolverla al volver. */
const CLAVE_SCROLL = "donpedro:scroll:v1";

type Calculo = { ok: true; resultado: ResultadoRecomendacion } | { ok: false; motivo: string };

function yaMedido(r: Respuestas): boolean {
  const clave = JSON.stringify(r);
  try {
    if (sessionStorage.getItem(CLAVE_VISTAS) === clave) return true;
    sessionStorage.setItem(CLAVE_VISTAS, clave);
  } catch {
    // sin sessionStorage se mide igualmente
  }
  return false;
}

export default function Recomendaciones() {
  const { respuestasCompletas, hidratado, irA, reiniciar } = useEstado();

  // Sin respuestas completas no hay nada que recomendar: vuelta a la primera pregunta.
  useEffect(() => {
    if (hidratado && !respuestasCompletas) irA("q1");
  }, [hidratado, respuestasCompletas, irA]);

  const [calculo, setCalculo] = useState<Calculo | null>(null);
  useEffect(() => {
    if (!respuestasCompletas) return;
    let vivo = true;
    cargarRecomendador()
      .then((recomendar) => {
        const resultado = recomendar(respuestasCompletas);
        return resultado.top.length
          ? ({ ok: true, resultado } as const)
          : ({ ok: false, motivo: "sin_resultados" } as const);
      })
      .catch((e: unknown) => ({ ok: false, motivo: e instanceof Error ? e.message : "recomendador" }) as const)
      .then((c) => {
        if (vivo) setCalculo(c);
      });
    return () => {
      vivo = false;
    };
  }, [respuestasCompletas]);

  // Tracking: una vez por conjunto de respuestas (ni StrictMode ni una recarga lo duplican).
  const vistas = useRef(false);
  useEffect(() => {
    if (vistas.current || !calculo || !respuestasCompletas) return;
    vistas.current = true;
    if (calculo.ok) {
      if (yaMedido(respuestasCompletas)) return;
      track("recomendaciones_vistas", {
        respuestas: respuestasCompletas,
        ids: calculo.resultado.top.map((p) => p.id),
      });
    } else {
      track("error_catalogo", { motivo: calculo.motivo });
    }
  }, [calculo, respuestasCompletas]);

  // Volver desde una ficha: se guarda la posición al salir y se restaura al volver a pintar.
  useEffect(() => {
    const guardar = () => {
      try {
        sessionStorage.setItem(CLAVE_SCROLL, String(Math.round(window.scrollY)));
      } catch {
        // sin sessionStorage no se recuerda
      }
    };
    window.addEventListener("pagehide", guardar);
    return () => window.removeEventListener("pagehide", guardar);
  }, []);
  const restaurado = useRef(false);
  useEffect(() => {
    if (restaurado.current || calculo?.ok !== true) return;
    restaurado.current = true;
    let y = 0;
    try {
      y = Number(sessionStorage.getItem(CLAVE_SCROLL)) || 0;
      sessionStorage.removeItem(CLAVE_SCROLL);
    } catch {
      return;
    }
    if (y > 0) requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y })));
  }, [calculo]);

  if (!respuestasCompletas || !calculo) {
    return (
      <section aria-label={ETIQUETA} className="relative isolate min-h-pantalla">
        <FondoOpacado />
      </section>
    );
  }

  if (!calculo.ok) {
    // Error: lo dice Don Pedro en la tienda, como en la trastienda.
    return (
      <EscenaTienda
        etiqueta={ETIQUETA}
        pose="apurado"
        arriba={
          <Boton variante="texto" anchoCompleto={false} onClick={reiniciar} className="pastilla min-h-tactil">
            {textos.resultados.volverAEmpezar}
          </Boton>
        }
        dialogo={<CuadroDialogo key="error" textos={textos.trastienda.error.burbujas} />}
        pie={
          <Boton href={urlTienda(config.tiendaZapatosUrl)} className="accion-destacada">
            {textos.trastienda.error.cta}
          </Boton>
        }
      />
    );
  }

  const { resultado } = calculo;

  return (
    <section aria-label={ETIQUETA} className="relative isolate flex w-full flex-col">
      {/* Seguimos dentro de la tienda, pero opacada para que manden las fotos (petición del usuario). */}
      <FondoOpacado />

      <h1 className="px-4 pt-3 text-center font-serif text-[28px] font-bold leading-[40px] text-tinta md:pt-5 md:text-[34px]">
        {textos.resultados.titulo}
      </h1>
      {/* Lo que Don Pedro dijo en la trastienda, para los lectores de pantalla. */}
      <p className="sr-only">{resumenRespuestas(respuestasCompletas, resultado.relajaciones)}</p>

      <Cuadricula productos={resultado.top} etiqueta={textos.resultados.etiquetaCuadricula} />

      <MasZapatos mas={resultado.mas} posicionInicial={resultado.top.length + 1} />

      <div className="mx-auto w-full max-w-md px-4 pb-10 pt-2">
        <Boton
          variante="secundario"
          href={urlTienda(config.tiendaZapatosUrl)}
          onClick={() => track("ver_tienda_click")}
        >
          {textos.resultados.verTienda}
        </Boton>
      </div>
    </section>
  );
}

/** Interior del local fijo detrás de los resultados, con un velo crema que lo opaca. */
function FondoOpacado() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <picture className="absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet={assets.interior.escritorio} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.interior.movil} alt="" className="h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-fondo/70" />
    </div>
  );
}
