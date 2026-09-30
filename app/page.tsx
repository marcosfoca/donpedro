"use client";
import { useEffect, useRef } from "react";
import { BotonSonido } from "@/components/base/BotonSonido";
import { FondoTienda } from "@/components/base/FondoTienda";
import { textos } from "@/content/textos";
import { EstadoProvider, esPregunta, useEstado } from "@/lib/estado";
import type { Fase } from "@/types";
import Fachada from "@/escenas/Fachada";
import Entrada from "@/escenas/Entrada";
import Saludo from "@/escenas/Saludo";
import Pregunta from "@/escenas/Pregunta";
import Trastienda from "@/escenas/Trastienda";
import Recomendaciones from "@/escenas/Recomendaciones";

function EscenaActiva() {
  const { fase } = useEstado();
  if (fase === "fachada") return <Fachada />;
  if (fase === "entrada") return <Entrada />;
  if (fase === "saludo") return <Saludo />;
  if (esPregunta(fase)) return <Pregunta key={fase} pregunta={fase} />;
  if (fase === "trastienda") return <Trastienda />;
  return <Recomendaciones />;
}

/** Fases de paso: al seguir, se sustituyen en el historial (el botón "atrás" no vuelve a ellas). */
const DE_PASO: readonly Fase[] = ["entrada", "trastienda"];

/**
 * El botón "atrás" del móvil o del navegador lleva al paso anterior de la experiencia, en vez de
 * sacar de la web (público sénior: predecible y perdonable). Cada fase deja su entrada en el
 * historial; al volver, se salta a esa fase conservando las respuestas.
 */
function useHistorial(fase: Fase, hidratado: boolean, irA: (f: Fase) => void) {
  const desdeHistorial = useRef(false);
  const enHistorial = useRef<Fase | null>(null);
  const actual = useRef(fase);
  actual.current = fase;

  useEffect(() => {
    if (!hidratado) return;
    if (desdeHistorial.current) {
      desdeHistorial.current = false;
      enHistorial.current = fase;
      return;
    }
    const previa = enHistorial.current;
    if (previa === fase) return;
    const estado = { ...(window.history.state ?? {}), donpedro: fase };
    if (previa === null || DE_PASO.includes(previa)) window.history.replaceState(estado, "");
    else window.history.pushState(estado, "");
    enHistorial.current = fase;
  }, [fase, hidratado]);

  useEffect(() => {
    const alVolver = (e: PopStateEvent) => {
      const destino = e.state?.donpedro as Fase | undefined;
      if (!destino) return;
      const f: Fase = destino === "entrada" ? "fachada" : destino;
      if (f === actual.current) return;
      desdeHistorial.current = true;
      irA(f);
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [irA]);
}

/**
 * Letra grande: si la persona tiene la letra ampliada (la raíz pasa de ~22 px; por defecto mide
 * 18), <html data-letra-grande> reorganiza lo que ya no cabe: opciones y zapatos en una columna,
 * progreso solo con "3 de 4", botón de sonido solo con el icono. Nada se pierde al ampliar.
 */
function useLetraGrande() {
  useEffect(() => {
    const raiz = document.documentElement;
    const medir = () => {
      const grande = parseFloat(getComputedStyle(raiz).fontSize) >= 22;
      if (grande) raiz.dataset.letraGrande = "1";
      else delete raiz.dataset.letraGrande;
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);
}

function Escenario() {
  const { fase, hidratado, irA } = useEstado();
  useHistorial(fase, hidratado, irA);
  useLetraGrande();
  const main = useRef<HTMLElement>(null);
  const primera = useRef(true);
  const hidratacionVista = useRef(false);

  // Al cambiar de escena: arriba del todo y foco al contenedor (teclado y lectores de pantalla).
  // El salto de fase que provoca la hidratación (usuaria que vuelve a mitad de recorrido) no
  // cuenta: ni sube la página ni roba el foco; resultados restaura su propia posición.
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (!hidratacionVista.current) {
      if (!hidratado) return;
      hidratacionVista.current = true;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [fase, hidratado]);

  return (
    <main ref={main} tabIndex={-1} aria-label={textos.accesible.principal} className="outline-none" data-fase={fase}>
      {/* En resultados no suena nada y el botón tapa la cabecera y las tarjetas. */}
      {fase !== "resultados" ? <BotonSonido /> : null}
      {/* Un solo fondo del interior para todas las escenas de dentro (desde la entrada, que lo
          destapa): no se vuelve a montar al cambiar de escena, así no parpadea en blanco. */}
      {fase !== "fachada" ? <FondoTienda opacado={fase === "resultados"} /> : null}
      <EscenaActiva />
    </main>
  );
}

export default function Pagina() {
  return (
    <EstadoProvider>
      <Escenario />
    </EstadoProvider>
  );
}
