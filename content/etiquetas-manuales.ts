/**
 * Correcciones manuales del etiquetado automático (diseno.md §5.3). Tienen prioridad.
 * Clave: id_product de PrestaShop. Solo se sobrescriben los campos presentes.
 *
 * Este archivo lo carga también scripts/sync-catalogo.mjs (transpilado en memoria):
 * que siga siendo autocontenido (solo `import type`).
 *
 * Para revisar qué falta: `node scripts/sync-catalogo.mjs --solo-informe`.
 */
import type { EtiquetasManuales } from "../lib/etiquetado";

/**
 * TACÓN según la ALTURA indicada en la ficha de cada producto en donpedrohabana.com
 * (revisión del 2026-09-29, solo donde la etiqueta automática era null o distinta).
 * Criterio (altura efectiva = altura − plataforma, si la ficha la da):
 *   ≤ 2 cm → plano · de 2 a 5,5 cm → bajo (la casa lo llama "tacón medio") · ≥ 6 cm → tacon.
 */
const TACON_SEGUN_FICHA: EtiquetasManuales = {
  90: { tacon: "bajo" }, // SALÓN DESTALONADO NEGRO · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  91: { tacon: "bajo" }, // SALÓN DESTALONADO BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  92: { tacon: "bajo" }, // SALÓN DESTALONADO ROJO · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  459: { tacon: "bajo" }, // SALON TERCIOPELO VERDE · auto: null · ficha: ALTURA DE TACON: 3 CM
  460: { tacon: "bajo" }, // SALON TERCIOPELO MAGENTA · auto: null · ficha: ALTURA DE TACON: 3 CM
  461: { tacon: "bajo" }, // SALÓN TERCIOPELO MARINO · auto: null · ficha: ALTURA DE TACON: 3 CM
  523: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR NEGRO · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  524: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR MARINO · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  529: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN BURDEOS · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  530: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN CUERO · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  531: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN MARINO · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  532: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN MARRÓN · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  533: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN NEGRO · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  567: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN PIEDRA · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  570: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR BEIGE-NEGRO · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  573: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR BEIGE-MARINO · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  574: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR MARINO-BLANCO · auto: null · ficha: ALTURA DE TACÓN: 4 CM
  575: { tacon: "bajo" }, // SALÓN SIN FORRO TACÓN ROJO · auto: tacon · ficha: ALTURA DE TACON: 5,5 CM
  632: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR NEGRO-BLANCO · auto: null · ficha: ALTURA DE TACÓN: 4 CM
  663: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR BEIGE-BEIGE · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  684: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR BEIGE-HIELO · auto: null · ficha: ALTURA DE TACÓN: 4CM
  702: { tacon: "tacon" }, // BOTIN CUÑA ANTE ELASTICO MARRON · auto: bajo · ficha: ALTURA DE CUÑA: 6,5CM
  710: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO NEGRO · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  711: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO MARRÓN · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  712: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO BEIGE · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  713: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO CUERO · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  776: { tacon: "bajo" }, // SANDALIA DE PIEL TRENZADA CON TACÓN NEGRA · auto: tacon · ficha: ALTURA DE TACÓN: 4CM
  793: { tacon: "bajo" }, // SANDALIA DE PIEL TRENZADA CON TACÓN AZUL · auto: tacon · ficha: ALTURA DE TACÓN: 4CM
  897: { tacon: "bajo" }, // SANDALIA DE TIRAS PUNTA CUADRADA CELESTE · auto: tacon · ficha: ALTURA DE TACÓN: 4 CM
  901: { tacon: "bajo" }, // SANDALIA DE TIRAS PUNTA CUADRADA CUERO · auto: tacon · ficha: ALTURA DE TACÓN: 4 CM
  1041: { tacon: "bajo" }, // SANDALIA DE PIEL TRENZADA CON TACÓN BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 4CM
  1110: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS BEIGE · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  1111: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS TOPO · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  1113: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS NEGRO · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  1115: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS AZUL · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  1190: { tacon: "tacon" }, // ZAPATO CRUZADO TERCIOPELO TURQUESA · auto: null · ficha: ALTURA DE TACON: 7 CM
  1314: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO TURQUESA · auto: null · ficha: ALTURA DE TACÓN: 7,5 CM
  1318: { tacon: "tacon" }, // SANDALIA CON NUDO EN TERCIOPELO TURQUESA · auto: null · ficha: ALTURA DE TACÓN: 7CM
  1320: { tacon: "tacon" }, // SANDALIA CON NUDO EN TERCIOPELO NUDE · auto: null · ficha: ALTURA DE TACÓN: 7CM
  1516: { tacon: "bajo" }, // SALÓN TERCIOPELO NEGRO · auto: null · ficha: ALTURA DE TACON: 3 CM
  1559: { tacon: "tacon" }, // BOTIN CORSO ANTE NEGRO · auto: null · ficha: ALTURA DE TACÓN: 6CM
  1560: { tacon: "tacon" }, // SALÓN DESTALONADO BICOLOR MARRÓN-BEIGE · auto: null · ficha: ALTURA DE TACÓN: 6 CM
  1561: { tacon: "bajo" }, // SALÓN CON TACÓN ANCHO ROJO · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  1619: { tacon: "bajo" }, // SALÓN CON TACÓN ANCHO MARINO · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  1620: { tacon: "bajo" }, // SALÓN CON TACÓN ANCHO NEGRO · auto: tacon · ficha: ALTURA DE TACON: 5 CM
  1662: { tacon: "bajo" }, // SALÓN DESTALONADO AZUL · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  1680: { tacon: "bajo" }, // SALÓN ANTE NUDE · auto: tacon · ficha: ALTURA DE TACON: 5 CM
  1720: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS NEGRO · auto: tacon · ficha: ALTURA TACÓN: 4,5 CM
  1722: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS CUERO · auto: tacon · ficha: ALTURA TACÓN: 4,5CM
  1723: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS AZUL · auto: tacon · ficha: ALTURA TACÓN: 4,5CM
  1724: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS BEIGE · auto: tacon · ficha: ALTURA TACÓN: 4,5CM
  1726: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS CORAL · auto: tacon · ficha: ALTURA TACÓN: 4,5CM
  1728: { tacon: "bajo" }, // SANDALIA ESCLAVA NEGRO · auto: null · ficha: ALTURA DE CUÑA: 2,5CM
  1779: { tacon: "bajo" }, // SANDALIA DE TIRAS PUNTA CUADRADA ROJO · auto: tacon · ficha: ALTURA DE TACÓN: 4 CM
  1875: { tacon: "bajo" }, // SANDALIAS CON TIRAS BICOLOR BLANCO/BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 4 CM
  1942: { tacon: "bajo" }, // SALÓN ANTE TOPO · auto: tacon · ficha: ALTURA DE TACÓN: 5,5 CM
  1943: { tacon: "bajo" }, // SALÓN ANTE NEGRO · auto: tacon · ficha: ALTURA DE TACÓN: 5,5 CM
  1944: { tacon: "bajo" }, // SALÓN ANTE CUERO · auto: tacon · ficha: ALTURA DE TACÓN: 5,5 CM
  2061: { tacon: "tacon" }, // BOTÍN CORSO ANTE MARRÓN · auto: null · ficha: ALTURA DE TACÓN: 6CM
  2122: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO GRIS · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  2129: { tacon: "tacon" }, // ZAPATO SALON TERCIOPELO BURDEOS · auto: null · ficha: ALTURA DE TACÓN: 7CM
  2136: { tacon: "tacon" }, // ZAPATO CRUZADO TERCIOPELO MARINO · auto: null · ficha: ALTURA DE TACON: 7 CM
  2138: { tacon: "tacon" }, // ZAPATO CRUZADO TERCIOPELO PÚRPURA · auto: null · ficha: ALTURA DE TACON: 7 CM
  2139: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO VERDE OSCURO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2140: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO GRIS · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2141: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO NEGRO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2142: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO TOPO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2208: { tacon: "bajo" }, // SALON TERCIOPELO  MARRON · auto: null · ficha: ALTURA DE TACON: 3 CM
  2232: { tacon: "bajo" }, // SALON TERCIOPELO BURDEOS · auto: null · ficha: ALTURA DE TACON: 3 CM
  2300: { tacon: "bajo" }, // SALÓN DESTALONADO ELASTICO BICOLOR CAMEL-NEGRO · auto: null · ficha: ALTURA TACÓN: 5CM
  2302: { tacon: "bajo" }, // SALÓN DESTALONADO ELASTICO BICOLOR CREMA-AVENA · auto: null · ficha: ALTURA TACÓN: 5CM
  2339: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR MARINO-BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2340: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR BEIGE-NEGRO · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2346: { tacon: "bajo" }, // SALÓN DESTALONADO BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2361: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR BEIGE-BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2394: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR NEGRO-BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2395: { tacon: "bajo" }, // SALÓN DESTALONADO BICOLOR AZUL-PIEDRA · auto: tacon · ficha: ALTURA DE TACÓN: 5,5CM
  2433: { tacon: "bajo" }, // SALÓN ELÁSTICO ORO · auto: null · ficha: ALTURA DE TACON: 5CM
  2508: { tacon: "bajo" }, // SALÓN PIEL BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5 CM
  2540: { tacon: "bajo" }, // SALÓN CON TACÓN ANCHO BEIGE · auto: tacon · ficha: ALTURA DE TACÓN: 5 CM
  2608: { tacon: "bajo" }, // SALÓN CON PUNTERA CHAROL NEGRO · auto: null · ficha: ALTURA DE CUÑA: 4,5CM
  2613: { tacon: "tacon" }, // ZAPATO TERCIOPELO MARINO · auto: null · ficha: ALTURA DE TACON: 7 CM
  2614: { tacon: "tacon" }, // ZAPATO TERCIOPELO BURDEOS · auto: null · ficha: ALTURA DE TACON: 7 CM
  2615: { tacon: "tacon" }, // ZAPATO TERCIOPELO TAUPE · auto: null · ficha: ALTURA DE TACON: 7 CM
  2653: { tacon: "bajo" }, // BOTIN DIENTES ELÁSTICO MARINO · auto: null · ficha: ALTURA CUÑA: 5 CM, plataforma 2 cm
  2655: { tacon: "tacon" }, // BOTÍN CORSO ANTE MARINO · auto: null · ficha: ALTURA DE TACÓN: 6CM
  2669: { tacon: "bajo" }, // SALÓN ANTE NEGRO · auto: tacon · ficha: ALTURA DE TACON: 5 CM
  2670: { tacon: "bajo" }, // SALÓN CON TACÓN CARRETE NEGRO · auto: tacon · ficha: ALTURA DE TACON: 5 CM
  2820: { tacon: "bajo" }, // SALÓN TACÓN TACHUELAS CHERRY · auto: tacon · ficha: ALTURA TACÓN: 4,5 CM
  2862: { tacon: "bajo" }, // SALÓN TACÓN CUERO · auto: tacon · ficha: ALTURA TACÓN: 4,5 CM
  2863: { tacon: "bajo" }, // SALÓN TACÓN MARRÓN · auto: tacon · ficha: ALTURA TACÓN: 4,5 CM
  2864: { tacon: "bajo" }, // SALÓN TACÓN NEGRO · auto: tacon · ficha: ALTURA TACÓN: 4,5 CM
  2915: { tacon: "tacon" }, // ZAPATO TERCIOPELO NEGRO · auto: null · ficha: ALTURA DE TACON: 7 CM
  2922: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO MALVA · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2924: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO BURDEOS · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  2949: { tacon: "tacon" }, // ZAPATO TERCIOPELO TIRAS LATERALES MARINO · auto: null · ficha: ALTURA DE TACÓN: 7CM
  2950: { tacon: "tacon" }, // ZAPATO TERCIOPELO TIRAS LATERALES NEGRO · auto: null · ficha: ALTURA DE TACÓN: 7CM
  2951: { tacon: "tacon" }, // ZAPATO TERCIOPELO TIRAS LATERALES BURDEOS · auto: null · ficha: ALTURA DE TACÓN: 7CM
  2952: { tacon: "tacon" }, // ZAPATO TERCIOPELO TIRAS LATERALES GRIS · auto: null · ficha: ALTURA DE TACÓN: 7CM
  2961: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS BLANCO · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  2962: { tacon: "bajo" }, // ALPARGATA VALENCIANA CINTAS ROJO · auto: plano · ficha: ALTURA DE CUÑA : 7CM, plataforma 2 cm
  2984: { tacon: "plano" }, // SANDALIA TIRA TRENZA BRONCE · auto: null · ficha: ALTURA TACÓN: 2CM
  2985: { tacon: "plano" }, // SANDALIA TIRA TRENZA PLOMO · auto: null · ficha: ALTURA TACÓN: 2CM
  2987: { tacon: "plano" }, // SANDALIA TIRA TRENZA NEGRO · auto: null · ficha: ALTURA TACÓN: 2CM
  2991: { tacon: "bajo" }, // SANDALIA TUBULARES CRUZADA BLANCO · auto: null · ficha: ALTURA: 3CM
  2996: { tacon: "bajo" }, // SANDALIA DE TIRAS BLANCO · auto: null · ficha: ALTURA:3CM
  3000: { tacon: "bajo" }, // SALON BICOLOR BEIGE TOPO · auto: null · ficha: ALTURA: 3CM
  3001: { tacon: "bajo" }, // SALON BICOLOR BLANCO TOPO · auto: null · ficha: ALTURA: 3CM
  3055: { tacon: "tacon" }, // ALPARGATA BONNY CAMEL · auto: bajo · ficha: ALTURA DE CUÑA: 7CM
  3056: { tacon: "tacon" }, // ALPARGATA BONNY TAUPE · auto: bajo · ficha: ALTURA DE CUÑA: 7CM
  3057: { tacon: "tacon" }, // ALPARGATA BONNY AZUL · auto: bajo · ficha: ALTURA DE CUÑA: 7CM
  3058: { tacon: "tacon" }, // ALPARGATA BONNY NEGRO · auto: bajo · ficha: ALTURA DE CUÑA: 7CM
  3113: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO NEGRO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3114: { tacon: "tacon" }, // ZAPATO CON ESCOTE REDONDO TERCIOPELO MALVA · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3115: { tacon: "tacon" }, // ZAPATO CON ESCOTE REDONDO TERCIOPELO NEGRO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3116: { tacon: "tacon" }, // ZAPATO CON ESCOTE REDONDO TERCIOPELO TOPO · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3117: { tacon: "tacon" }, // ZAPATO CON ESCOTE REDONDO TERCIOPELO AZUL · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3118: { tacon: "tacon" }, // ZAPATO CON ESCOTE REDONDO TERCIOPELO BURDEOS · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3127: { tacon: "bajo" }, // SALÓN PIEL NUDE · auto: tacon · ficha: ALTURA DE TACÓN: 5,5 CM
  3168: { tacon: "tacon" }, // ZAPATO CON ESCOTE CRUZADO DE TERCIOPELO TAUPE · auto: null · ficha: ALTURA DE TACÓN: 7,5CM
  3246: { tacon: "tacon" }, // ZAPATO CRUZADO TERCIOPELO MARRÓN · auto: null · ficha: ALTURA DE TACON: 7 CM
};

/**
 * Otras correcciones revisadas a mano (color, modelo, estaciones…), deducidas del nombre o
 * la descripción cuando la ficha no da la altura.
 */
const OTRAS: EtiquetasManuales = {
  1715: { tacon: "plano" }, // SANDALIA PIEL TRENZADA · "sandalia de dedo" → plana
  1967: { tacon: "plano" }, // BOTIN AGUA · botín de goma para lluvia → plano
  1968: { tacon: "plano" }, // BOTIN AGUA
  1969: { tacon: "plano" }, // BOTIN AGUA
  1970: { tacon: "plano" }, // BOTIN AGUA
  3344: { tacon: "plano" }, // BOTIN SERRAJE TIPO CAZA · "botín sport… piso de goma tipo montaña" → plano
  3345: { tacon: "plano" }, // BOTIN SERRAJE TIPO CAZA

  // TACÓN sin altura en la ficha: deducido de la foto solo cuando no deja dudas.
  // Quedan sin etiquetar (null, puntúan neutro): BOTIN LEYNA ANTE (2079, 2672),
  // SANDALIA PLATAFORMA ANTE (3107) y BOTIN CORDONES SERRAJE (3250, 3251).
  88: { tacon: "bajo" }, // ZAPATO CON TIRAS CRUZADAS · tacón ancho medio
  89: { tacon: "bajo" }, // ZAPATO CON TIRAS CRUZADAS · tacón ancho medio
  1567: { tacon: "bajo" }, // ZAPATO CON TIRAS CRUZADAS · tacón ancho medio
  2199: { tacon: "bajo" }, // BOTIN TACHUELAS · tacón cowboy bajo
  2671: { tacon: "bajo" }, // BOTIN TACHUELAS · tacón cowboy bajo
  3241: { tacon: "bajo" }, // BOTIN TACHUELAS · tacón cowboy bajo
  2597: { tacon: "plano" }, // BOTIN BAJO PELO · piso de goma plano
  2598: { tacon: "plano" }, // BOTIN BAJO PELO · piso de goma plano
  2599: { tacon: "plano" }, // BOTIN BAJO PELO · piso de goma plano
  3226: { tacon: "plano" }, // BOTIN BAJO PELO · piso de goma plano
  2659: { tacon: "bajo" }, // BOTA CORSO · tacón ancho bajo
  2660: { tacon: "bajo" }, // BOTA CORSO · tacón ancho bajo
  2661: { tacon: "bajo" }, // BOTA CORSO · tacón ancho bajo
  2662: { tacon: "bajo" }, // BOTA CORSO · tacón ancho bajo
  2774: { tacon: "bajo" }, // PADME · tacón ancho bajo
  2931: { tacon: "plano" }, // SANDALIA ESCLAVA ADORNO METALICO · plana de dedo
  2932: { tacon: "plano" }, // SANDALIA ESCLAVA ADORNO METALICO · plana de dedo
  3263: { tacon: "bajo" }, // SALON ABERTURA LATERAL PIEL · tacón pequeño
  3264: { tacon: "bajo" }, // SALON ABERTURA LATERAL PIEL · tacón pequeño
  3265: { tacon: "bajo" }, // SALON ABERTURA LATERAL PIEL · tacón pequeño

  // COLOR: el nombre no lo dice; comprobado con la foto del producto.
  2708: { color: "negro" }, // ZAPATO SOFT PIEL ELASTICO · negro
  3331: { color: "marron" }, // ZAPATO SOFT PIEL ELASTICO · marrón oscuro
  2711: { color: "beige" }, // ZAPATO SOFT SERRAJE ELASTICO · taupe
  2712: { color: "marron" }, // ZAPATO SOFT SERRAJE ELASTICO · marrón oscuro
  2713: { color: "marron" }, // ZAPATO SOFT SERRAJE ELASTICO · camel
  3060: { color: "marron" }, // BOTIN ANTE CALADO PRIMAVERAL · camel
  3083: { color: "marron" }, // SANDALIA- ALPARGATA DE PIEL · cuero
  1988: { color: "marron" }, // ZAPATILLAS DE CASA DE VIAJE CON ESTUCHE · camel
  1991: { color: "rosa" }, // ZAPATILLA CON CUÑA DE PANA · rosa
};

export const etiquetasManuales: EtiquetasManuales = { ...TACON_SEGUN_FICHA };
for (const [id, e] of Object.entries(OTRAS)) {
  etiquetasManuales[Number(id)] = { ...etiquetasManuales[Number(id)], ...e };
}

export default etiquetasManuales;
