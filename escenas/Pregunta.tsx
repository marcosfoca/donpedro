"use client";
/**
 * Q1–Q4 (diseno.md §2). Un único componente parametrizado.
 * Contrato: page.tsx monta <Pregunta key={fase} pregunta={fase} /> (se remonta en cada pregunta).
 *
 * Cada cosa tiene su momento (petición del usuario, 2026-09-30):
 *   1. "dialogo": Don Pedro, de pie en la tienda, hace la pregunta (cuadro arriba). Se sigue AL
 *      TOCAR (petición del usuario: cada clienta a su ritmo), igual que tras la reacción.
 *   2. "opciones": Don Pedro se retira, la pregunta se queda arriba y las tarjetas salen con
 *      rebote en cascada, icono y brillo (efecto "wow" de aparición).
 *   3. "eligiendo": la tarjeta elegida rebota con anillo, sello y chispas; las demás se apartan.
 *   4. "cerrando" → "reaccion": las opciones se retiran, Don Pedro vuelve contento y reacciona
 *      (≤ 40 caracteres) y, al tocar, se pasa a la pregunta siguiente.
 * En Q4, "Uno en concreto" abre "dialogoColores" → "colores" (muestras, una o varias, y "Seguir").
 * Si la pregunta ya tenía respuesta (volver con "Atrás"), se empieza en "opciones".
 * Consejo 2026-09-30 (docs/decisiones/2026-09-30-momentos-quiz.md): el guía se retira durante las
 * opciones y vuelve para reaccionar; en los colores, selección múltiple con "Seguir".
 *
 * Persuasión: micro-compromisos (una decisión por pantalla), progreso visible con aria-live
 * (bucle 2, Zeigarnik), "ser escuchada" (reacción personalizada a cada respuesta).
 */
import { useEffect, useRef, useState } from "react";
import { BarraProgreso, Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { MuestrasColor, Opcion } from "@/components/quiz";
import { assets } from "@/content/assets";
import { personaje } from "@/content/personaje";
import { textos, type PreguntaTexto } from "@/content/textos";
import { CAMPO_PREGUNTA, useEstado } from "@/lib/estado";
import { movimiento } from "@/lib/tokens";
import type { FasePregunta, Tono, ValorPregunta } from "@/types";

/** Preguntas con 4 opciones van en rejilla 2×2; las de 3, en lista (imagen a la izquierda). */
const REJILLA: Record<FasePregunta, boolean> = { q1: true, q2: false, q3: false, q4: true };

type Momento =
  | "dialogo"
  | "opciones"
  | "eligiendo"
  | "cerrando"
  | "reaccion"
  | "dialogoColores"
  | "colores"
  | "cerrandoColores";

/** Momentos en los que Don Pedro está en la tienda hablando. */
const HABLA: Momento[] = ["dialogo", "reaccion", "dialogoColores"];

export default function Pregunta({ pregunta }: { pregunta: FasePregunta }) {
  const { respuestas, responder, elegirTonos, avanzar, retroceder, progreso } = useEstado();
  const t = textos.preguntas[pregunta] as PreguntaTexto<string>;
  const iconos = assets.iconos[pregunta] as Record<string, string>;
  const guardada = respuestas[CAMPO_PREGUNTA[pregunta]];

  const [momento, setMomento] = useState<Momento>(guardada ? "opciones" : "dialogo");
  /** Opción elegida en esta visita. */
  const [elegida, setElegida] = useState<string | null>(null);
  const [tonos, setTonos] = useState<Tono[]>(respuestas.tonos ?? []);
  /** Pulsó "Seguir" sin marcar ningún color: Don Pedro se lo explica (sin botones desactivados mudos). */
  const [avisoColores, setAvisoColores] = useState(false);
  const bloqueado = useRef(false);
  const temporizadores = useRef<number[]>([]);
  const avanzado = useRef(false);

  const despues = (ms: number, fn: () => void) => {
    temporizadores.current.push(window.setTimeout(fn, ms));
  };

  // Precarga la pose "contento" (reacción) y, en la última pregunta, la de la trastienda.
  useEffect(() => {
    new Image().src = personaje.poses.contento;
    if (pregunta === "q4") {
      new Image().src = personaje.poses.trastienda;
      for (const src of Object.values(assets.muestras)) new Image().src = src;
    }
    return () => temporizadores.current.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seguir = () => {
    if (avanzado.current) return;
    avanzado.current = true;
    avanzar();
  };

  const elegir = (id: string) => {
    if (bloqueado.current) return; // evita el doble toque
    bloqueado.current = true;
    navigator.vibrate?.(15);
    setElegida(id);
    const colores = pregunta === "q4" && id === "concreto";
    // "Uno en concreto" se guarda con sus tonos al pulsar "Seguir" (un solo evento de medición).
    if (!colores) responder(pregunta, id as ValorPregunta[typeof pregunta]);
    setMomento("eligiendo");
    despues(movimiento.eleccionMs, () => setMomento("cerrando"));
    despues(movimiento.eleccionMs + movimiento.salidaMs, () => setMomento(colores ? "dialogoColores" : "reaccion"));
  };

  const confirmarColores = () => {
    if (momento !== "colores") return;
    if (!tonos.length) {
      setAvisoColores(true);
      return;
    }
    elegirTonos(tonos);
    setMomento("cerrandoColores");
    despues(movimiento.salidaMs, () => setMomento("reaccion"));
  };

  const atras = () => {
    temporizadores.current.forEach((id) => window.clearTimeout(id));
    temporizadores.current = [];
    if (momento === "colores") {
      // De las muestras se vuelve a las cuatro opciones de Q4, no a la pregunta anterior.
      bloqueado.current = false;
      setElegida(null);
      setMomento("opciones");
      return;
    }
    retroceder();
  };

  const habla = HABLA.includes(momento);

  // Foco (teclado y lectores de pantalla): a la primera opción cuando salen, y al cuadro cuando
  // vuelve a hablar Don Pedro (QA móvil, I-4). Con el dedo no se ve el anillo (:focus-visible).
  useEffect(() => {
    const main = document.querySelector("main");
    if (momento === "opciones" || momento === "colores") {
      main?.querySelector<HTMLElement>('[role="group"] button')?.focus({ preventScroll: true });
    } else if (HABLA.includes(momento)) {
      main?.querySelector<HTMLElement>('[aria-live] button:not([tabindex="-1"])')?.focus({ preventScroll: true });
    }
  }, [momento]);

  // Cuando Don Pedro vuelve a hablar, arriba: si la página estaba desplazada (muestras en pantallas
  // bajas), su cuadro quedaba fuera de la vista (QA móvil, I-1).
  useEffect(() => {
    if (HABLA.includes(momento)) window.scrollTo({ top: 0 });
  }, [momento]);
  const conOpciones = momento === "opciones" || momento === "eligiendo" || momento === "cerrando";
  const conColores = momento === "colores" || momento === "cerrandoColores";
  const seleccion = elegida ?? guardada ?? null;
  const rejilla = REJILLA[pregunta];

  /** Pasa de un momento a otro solo si seguimos en el de origen (los temporizadores llegan tarde). */
  const pasar = (de: Momento, a: Momento) => () => setMomento((m) => (m === de ? a : m));

  // Qué dice el cuadro en cada momento (la key nueva monta otra conversación). Mientras habla,
  // se avanza AL TOCAR (el cuadro o cualquier parte): cada clienta a su ritmo.
  const dialogo =
    momento === "reaccion"
      ? { key: "reaccion", frase: t.reacciones[elegida ?? ""] ?? "", fin: seguir }
      : momento === "dialogoColores" || conColores
        ? {
            key: avisoColores ? "aviso" : "colores",
            frase: avisoColores ? textos.colores.aviso : textos.colores.pregunta,
            fin: pasar("dialogoColores", "colores"),
          }
        : { key: "pregunta", frase: t.pregunta, fin: pasar("dialogo", "opciones") };

  return (
    <EscenaTienda
      etiqueta={progreso ? textos.quiz.progresoAccesible(progreso.paso, progreso.total) : t.pregunta}
      pose={momento === "reaccion" ? "contento" : "escuchando"}
      donPedro={habla}
      arriba={progreso ? <BarraProgreso paso={progreso.paso} total={progreso.total} /> : null}
      dialogo={
        <CuadroDialogo
          key={dialogo.key}
          textos={[dialogo.frase]}
          onFin={habla ? dialogo.fin : undefined}
          pico={habla ? "abajo" : "ninguno"}
        />
      }
      pie={
        // "Atrás" siempre en el mismo sitio (también mientras pregunta); se oculta solo durante las
        // transiciones de la elección.
        momento === "dialogo" || momento === "dialogoColores" || momento === "opciones" || conColores ? (
          <>
            <Boton variante="texto" anchoCompleto={false} onClick={atras} className="pastilla min-h-tactil">
              <span aria-hidden="true">←</span>
              {textos.quiz.atras}
            </Boton>
            {conColores ? (
              <Boton onClick={confirmarColores} className="flex-1">
                {textos.colores.seguir}
              </Boton>
            ) : null}
          </>
        ) : null
      }
    >
      {conOpciones ? (
        <div
          role="group"
          aria-label={t.pregunta}
          className={[
            rejilla ? "grid grid-cols-2 gap-2.5 [[data-letra-grande]_&]:grid-cols-1" : "flex flex-col gap-2.5",
            "transition-[opacity,transform] duration-300 ease-suave",
            momento === "cerrando" ? "translate-y-2 opacity-0" : "",
          ].join(" ")}
        >
          {t.opciones.map((o, i) => {
            const marcada = seleccion === o.id;
            return (
              <Opcion
                key={o.id}
                indice={i}
                estado={momento === "opciones" ? "entrando" : o.id === elegida ? "elegida" : "descartada"}
                imagen={iconos[o.id]}
                texto={o.texto}
                subtexto={o.subtexto}
                seleccionada={marcada}
                disposicion={rejilla ? "vertical" : "horizontal"}
                aria-disabled={momento !== "opciones" && !marcada ? true : undefined}
                onClick={() => elegir(o.id)}
                className={marcada ? "ring-2 ring-cuero" : ""}
              />
            );
          })}
        </div>
      ) : null}
      {conColores ? (
        <MuestrasColor
          marcados={tonos}
          onCambio={(t) => {
            setTonos(t);
            if (t.length) setAvisoColores(false);
          }}
          saliendo={momento === "cerrandoColores"}
        />
      ) : null}
    </EscenaTienda>
  );
}
