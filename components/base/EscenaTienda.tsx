import type { ReactNode } from "react";
import { assets } from "@/content/assets";
import type { Pose } from "@/content/personaje";
import { DonPedroEnTienda } from "./DonPedroEnTienda";
import { Escena } from "./Escena";

type EscenaTiendaProps = {
  /** Nombre accesible de la sección. */
  etiqueta: string;
  pose: Pose;
  /** false mientras se enseñan opciones: Don Pedro se retira y vuelve para reaccionar. */
  donPedro?: boolean;
  /** Fila superior (Saltar, progreso, Atrás). A la derecha queda el botón de sonido (fijo). */
  arriba?: ReactNode;
  /** El cuadro de diálogo (CuadroDialogo), arriba, con el pico hacia Don Pedro. */
  dialogo: ReactNode;
  /** Lo que sale después del diálogo (opciones, muestras…), debajo del cuadro. */
  children?: ReactNode;
  /**
   * Abajo: la acción tras hablar con Don Pedro ("Empezamos", "Ver los zapatos"…), delante de sus
   * zapatos y con la clase "accion-destacada" para que llame la atención; o, mientras se responde,
   * "Atrás" y "Seguir".
   */
  pie?: ReactNode;
};

/**
 * Escena dentro de la tienda (S, Q, E y errores). Cada cosa tiene su momento (petición del
 * usuario): primero habla Don Pedro, de pie en el suelo, con un cuadro de diálogo arriba; después
 * sale lo demás. Sin velos sobre la ilustración.
 *
 *   ┌ arriba (48 px) ───────── [Sonido] ┐
 *   │ diálogo                           │
 *   │ contenido (opciones) / Don Pedro  │
 *   └ pie (acción, o Atrás y Seguir) ───┘
 */
export function EscenaTienda({
  etiqueta,
  pose,
  donPedro = true,
  arriba,
  dialogo,
  children,
  pie,
}: EscenaTiendaProps) {
  return (
    <Escena
      etiqueta={etiqueta}
      fondo={{ ...assets.interior }}
      velo="ninguno"
      claseContenido="relative mx-auto flex min-h-pantalla w-full max-w-xl flex-col px-4 pb-4 pt-3"
    >
      <DonPedroEnTienda pose={pose} presente={donPedro} />
      {/* Capas: el diálogo (z-40) lleva una capa que avanza al tocar en cualquier parte; arriba (z-50),
          el contenido y el pie (z-40, después en el DOM) quedan por encima y se pueden tocar. */}
      {/* Los contenedores no atrapan toques (pointer-events-none); solo su contenido real. */}
      <div className="pointer-events-none relative z-50 flex min-h-tactil items-center gap-2 pr-28 [&>*]:pointer-events-auto">{arriba}</div>
      <div className="relative z-40 mt-3">{dialogo}</div>
      <div className="pointer-events-none relative z-40 mt-3 flex flex-1 flex-col [&>*]:pointer-events-auto">{children}</div>
      <div className="pointer-events-none relative z-40 mt-3 flex min-h-boton items-end gap-3 [&>*]:pointer-events-auto">{pie}</div>
    </Escena>
  );
}
