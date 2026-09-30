/**
 * Tokens de diseño (diseno.md §4.1). Fuente única: tailwind.config.ts los importa.
 *
 * Contraste verificado (WCAG 2.1):
 * - cuero #816040 con texto fondo #FBF7EA -> 5,32:1 (AA OK, se mantiene #816040)
 * - cuero #816040 sobre blanco -> 5,71:1 (precio en tarjeta, AA OK)
 * - cuero #816040 con crema #F1E6B2 -> 4,54:1 (justo; NO usar crema como texto de botón)
 * - gris #666 sobre fondo -> 5,36:1 (OK) · grisClaro #999 -> 2,66:1 (solo decorativo, nunca texto)
 */
export const colores = {
  cuero: "#816040",
  cueroOscuro: "#6B4F33", // hover/pressed
  crema: "#F1E6B2",
  fondo: "#FBF7EA", // fondo general y texto de botones primarios
  dorado: "#CEB888",
  marino: "#2E4674",
  tinta: "#2B2118",
  gris: "#666666",
  grisClaro: "#999999",
  blanco: "#FFFFFF",
} as const;

/** Tiempos de la experiencia en ms (diseno.md §2). */
export const movimiento = {
  reaccionMs: 2400, // reacción de Don Pedro tras elegir opción (≤ 40 caracteres: legible para sénior); tocar adelanta
  entradaMs: 1200, // transición T (puerta)
  fundidoReducidoMs: 300, // sustituto con prefers-reduced-motion
  aparicionMs: 350, // aparición de una burbuja / tarjeta
  eleccionMs: 650, // efecto de la tarjeta elegida antes de que Don Pedro reaccione
  salidaMs: 260, // las opciones se retiran y vuelve Don Pedro
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/** Tamaños mínimos sénior (px). */
export const tamanos = {
  textoBase: 18,
  textoBurbuja: 20,
  textoBoton: 18,
  altoBoton: 56,
  altoBotonTarjeta: 48,
  zonaTactil: 48,
  tarjetaResultadoMinAlto: 220,
  anchoMaximoResultados: 960,
} as const;
