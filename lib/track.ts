/**
 * Adaptador de analítica (diseno.md §5.5). CONGELADO: hoy NO envía nada.
 * En desarrollo hace console.debug. Cuando se descongele: Meta Pixel/CAPI, GA4 o PostHog,
 * siempre con banner de consentimiento. Las claves irán en variables de entorno (.env.example).
 */
import type { Respuestas } from "@/types";

export type EventosTracking = {
  experiencia_vista: undefined; // F (lo dispara la escena Fachada al montarse)
  puerta_abierta: undefined; // F -> T
  saludo_completado: undefined; // S -> Q1
  pregunta_respondida: { n: number; id: string; tonos?: string }; // lo dispara lib/estado.tsx (responder, elegirTonos)
  recomendaciones_vistas: { respuestas: Respuestas; ids: number[] }; // -> ViewContent
  comprar_click: { id: number; precio: number; posicion: number }; // -> intención AddToCart
  mas_zapatos_click: undefined;
  ver_tienda_click: undefined;
  reinicio: undefined; // lo dispara lib/estado.tsx (reiniciar)
  error_catalogo: { motivo?: string } | undefined;
};

export type NombreEvento = keyof EventosTracking;

type Args<E extends NombreEvento> = undefined extends EventosTracking[E]
  ? [props?: EventosTracking[E]]
  : [props: EventosTracking[E]];

export function track<E extends NombreEvento>(evento: E, ...args: Args<E>): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", evento, args[0] ?? {});
  }
  // Aquí se conectarán los proveedores cuando se descongele el tracking.
}
