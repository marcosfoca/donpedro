/**
 * Geometría de la fachada (A1) y de la puerta (A2). ÚNICO sitio que hay que tocar cuando llegue
 * el arte final.
 *
 * - La posición de la puerta se expresa en FRACCIONES DE LA IMAGEN (0..1), no de la pantalla.
 *   El hook useZonaPuerta la traduce a píxeles aplicando el mismo "object-fit: cover" y
 *   "object-position" que el fondo, así que la capa de la puerta cae siempre encima de la puerta
 *   pintada sea cual sea el tamaño de la pantalla o la proporción real del archivo.
 * - Para ajustarla: abrir la ilustración, medir el rectángulo de la hoja de la puerta
 *   (x, y = esquina superior izquierda; ancho, alto) y dividir entre el ancho/alto de la imagen.
 */

/** Mismo punto de corte que <source media> de la fachada (versión escritorio). */
export const MEDIA_ESCRITORIO = "(min-width: 768px)";

export type Zona = { x: number; y: number; ancho: number; alto: number };
export type Encuadre = {
  /** object-position en fracciones (0 = izquierda/arriba, 1 = derecha/abajo). */
  posicion: { x: number; y: number };
  /** Rectángulo de la hoja de la puerta dentro de la imagen, en fracciones. */
  puerta: Zona;
  /** Proporción de respaldo (ancho/alto) mientras la imagen no ha cargado. */
  proporcion: number;
  /**
   * Alto extra de la ilustración respecto a la pantalla (fracción). La imagen se pinta más alta
   * que el contenedor y anclada arriba: se recorta la acera de abajo y la fachada baja, dejando
   * más cielo. Ojo: la puerta baja con ella y puede tapar lo que hay al pie de la pantalla.
   */
  alturaExtra: number;
};

export const ENCUADRE: { movil: Encuadre; escritorio: Encuadre } = {
  movil: {
    // Se ancla abajo para que nunca se corte la tienda; lo que se recorta es cielo.
    posicion: { x: 0.5, y: 0.85 },
    // Medido en arte/aprobado/fachada-dia.png (768×1376): hoja x 404–560, y 796–1200.
    puerta: { x: 404 / 768, y: 796 / 1376, ancho: 156 / 768, alto: 404 / 1376 },
    proporcion: 768 / 1376,
    // 0: la acera de abajo queda entera a la vista y la puerta termina al 87 % del alto; ahí, bajo
    // la puerta, va la dirección. Con 0,08 la puerta bajaba hasta el 94 % y tapaba la dirección.
    alturaExtra: 0,
  },
  escritorio: {
    posicion: { x: 0.5, y: 0.8 },
    // Medido en arte/aprobado/fachada-dia-escritorio.png (1376×768): hoja x 700–797, y 448–692.
    puerta: { x: 700 / 1376, y: 448 / 768, ancho: 97 / 1376, alto: 244 / 768 },
    proporcion: 1376 / 768,
    alturaExtra: 0,
  },
};


export type Rect = { left: number; top: number; width: number; height: number };

/** Traduce una zona de la imagen a píxeles del contenedor aplicando object-fit: cover. */
export function zonaEnPantalla(
  contenedor: { ancho: number; alto: number },
  imagen: { ancho: number; alto: number },
  encuadre: Encuadre,
): Rect {
  const escala = Math.max(contenedor.ancho / imagen.ancho, contenedor.alto / imagen.alto);
  const anchoPintado = imagen.ancho * escala;
  const altoPintado = imagen.alto * escala;
  const dx = (contenedor.ancho - anchoPintado) * encuadre.posicion.x;
  const dy = (contenedor.alto - altoPintado) * encuadre.posicion.y;
  const z = encuadre.puerta;
  return {
    left: dx + z.x * anchoPintado,
    top: dy + z.y * altoPintado,
    width: z.ancho * anchoPintado,
    height: z.alto * altoPintado,
  };
}

export function posicionCss(e: Encuadre): string {
  return `${e.posicion.x * 100}% ${e.posicion.y * 100}%`;
}
