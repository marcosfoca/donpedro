/**
 * Único punto de referencia del personaje (diseno.md §6, "Sustituibilidad").
 * Ningún componente debe apuntar a /arte/don-pedro/* directamente: siempre personaje.poses.
 */
export type Pose = "saludo" | "escuchando" | "contento" | "trastienda" | "senalando" | "apurado";

export const personaje: { nombre: string; poses: Record<Pose, string>; alt: Record<Pose, string> } = {
  nombre: "Don Pedro",
  poses: {
    saludo: "/arte/don-pedro/saludo.webp",
    escuchando: "/arte/don-pedro/escuchando.webp",
    contento: "/arte/don-pedro/contento.webp",
    trastienda: "/arte/don-pedro/trastienda.webp",
    senalando: "/arte/don-pedro/senalando.webp",
    apurado: "/arte/don-pedro/apurado.webp",
  },
  // Don Pedro es decorativo junto a sus burbujas (que ya se anuncian). Si se quiere
  // describir, usar estos textos; por defecto los componentes usan alt="".
  alt: {
    saludo: "Don Pedro saluda desde detrás del mostrador",
    escuchando: "Don Pedro escucha con atención",
    contento: "Don Pedro sonríe",
    trastienda: "Don Pedro va a la trastienda con una caja de zapatos",
    senalando: "Don Pedro señala los zapatos",
    apurado: "Don Pedro se rasca la cabeza, apurado",
  },
};
