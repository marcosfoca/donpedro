# Consejo de decisión

## Caso

## Contexto
Landing gamificada para una zapatería familiar de Madrid (desde 1958). Público: mujeres de más de 50 años, en móvil (diseñamos para 375×667). Un personaje guía ilustrado (el fundador, caricatura tierna, de cuerpo entero) atiende a la clienta dentro de la tienda ilustrada, le hace 4 preguntas y le recomienda 6 zapatos.

El usuario de la agencia acaba de pedir:
- Que cada cuadro de diálogo tenga "su momento": primero sale un cuadro, luego el siguiente, mientras el guía habla. Así se gana espacio y el guía puede estar DE PIE EN EL SUELO de la tienda, de forma natural (hasta ahora parecía flotar detrás del diálogo).
- En resultados: primero habla el guía y después salen solamente los productos.
- En el quiz: un efecto "wow" al aparecer las opciones y al elegir una.
- La pregunta de color pasa a ser: "Discretos / Llamativos / Cualquiera / Uno en concreto"; si elige "Uno en concreto", se le deja elegir colores concretos (negro, marrón, beige, azul marino, rojo, dorado…).

Diseño previsto para cada pregunta: (1) momento de diálogo: el guía de pie en el suelo (≈54 % del alto), el cuadro de diálogo arriba con la pregunta; (2) momento de opciones: aparecen las tarjetas con animación; (3) al elegir: animación de selección y (4) el guía reacciona en su cuadro (momento de diálogo) y se pasa a la siguiente pregunta.

## Decisión 1
¿Qué pasa con el guía y con la pregunta durante el momento de opciones (las 4 tarjetas ocupan ≈310 px de alto)?

## Opciones (decisión 1)
A) La pregunta se queda en su cuadro arriba; el guía se retira (se desvanece) y las tarjetas ocupan su sitio. Vuelve para reaccionar. (La que yo haría.)
B) La pregunta se queda arriba y el guía sigue de pie detrás de las tarjetas, que le tapan de la cintura para abajo.
C) El guía se hace pequeño y se aparta a una esquina (se le ve entero, a ≈25 % del alto) mientras las tarjetas ocupan el resto.
D) El cuadro de la pregunta desaparece y se sustituye por un título corto en una pastilla; el guía se retira.

## Decisión 2
En "Uno en concreto", ¿la clienta elige un solo color o varios?

## Opciones (decisión 2)
A) Varios: toca las muestras que quiera (se marcan) y confirma con un botón "Seguir". (La que yo haría: "negro o marrón" es una respuesta muy habitual.)
B) Uno solo: tocar una muestra ya responde y avanza (un toque menos, coherente con el nombre de la opción).
C) Uno por defecto, con un enlace "Añadir otro color".

## Criterios (en orden)
1. Claridad y facilidad para una clienta sénior en móvil (sin dudas sobre qué tocar).
2. Cumplir lo pedido por el usuario de la agencia (momentos de diálogo, guía de pie en la tienda, efecto wow).
3. Conversión: que las recomendaciones encajen con lo que quiere (menos relajaciones del filtro de color).
4. Sensación de estar atendida por el personaje.
5. Coste de implementación.

## Restricciones
- Zonas táctiles ≥ 48 px, textos ≥ 18 px, sin scroll en las preguntas a 375×667.
- Sin velos sobre la tienda en las escenas del guía.
- Lo que el guía dice ("en negro o marrón") debe ser un filtro que excluye; si faltan zapatos, lo avisa.


## Consejo

```json
{
  "resumen": {
    "votos": {
      "DECISIÓN 1: A. DECISIÓN 2: A": 1,
      "A": 1
    },
    "mayoria": "DECISIÓN 1: A. DECISIÓN 2: A",
    "unanime": false,
    "confianza_media": 0.87
  },
  "opiniones": [
    {
      "modelo": "moonshotai/kimi-k3",
      "ok": true,
      "respuesta": {
        "opcion": "Decisión 1: A. Decisión 2: A",
        "recomendacion": "D1: el guía se desvanece al aparecer las tarjetas y vuelve para reaccionar, con la pregunta fija arriba. D2: selección múltiple de colores con botón 'Seguir'.",
        "confianza": 0.82,
        "razones": [
          "D1-A: en 375×667 no caben guía entero (54%) + 310px de tarjetas sin solapar; retirarlo evita el efecto 'tapado por la cintura' (B), que rompe la ilusión de estar de pie en la tienda que el cliente pidió.",
          "D1-A: la pregunta fija arriba da ancla visual a una usuaria sénior; D la sustituye por una pastilla que obliga a recordar la pregunta y añade un cambio de layout innecesario.",
          "D1-A: la salida y reaparición del guía con animación es en sí misma parte del 'momento' y del efecto wow pedido, y refuerza la sensación de que reacciona a tu elección (criterio 4).",
          "D2-A: 'negro o marrón' es la respuesta real más común en este público; forzar un solo color (B) relajaría después el filtro o frustraría, y C esconde la función tras un enlace poco descubrible para sénior."
        ],
        "riesgos": [
          "D1: si la transición de salida/entrada del guía es lenta o brusca, puede parecer que 'desaparece' en vez de apartarse; cuidar timing (≤300ms) y que vuelva con una línea de reacción.",
          "D2-A: el botón 'Seguir' añade un toque y una usuaria podría no verlo; mitigar con botón grande ≥48px, visible sin scroll y activado solo tras marcar al menos un color.",
          "D2-A: selección múltiple amplía el filtro (OR), riesgo de recomendaciones menos afinadas si marca muchos colores; el guía puede comentarlo ('¡qué bien, así tenemos más donde elegir!')."
        ],
        "cambiaria_si": "D1: si el arte del guía permitiera una versión de medio cuerpo natural (tras el mostrador), B/C ganarían. D2: si los datos de la tienda mostraran que el filtro de color casi nunca se combina o que el catálogo por color es escaso y la multi-selección genera demasiados resultados vacíos.",
        "alternativa": "D2: permitir varios colores pero que tocar una muestra la marque y, si no toca nada más en ~1,2s, mostrar el botón 'Seguir' ya resaltado; y en D1, que el guía no se desvanezca del todo sino que salga por un lateral caminando (más 'tienda real' que un fade)."
      },
      "segundos": 122.6
    },
    {
      "modelo": "nvidia/nemotron-3-ultra-550b-a55b",
      "ok": true,
      "respuesta": {
        "opcion": "A",
        "recomendacion": "En el momento de opciones, la pregunta permanece en su cuadro superior, el guía se desvanece para ceder el espacio a las tarjetas (con su animación wow) y reaparece para reaccionar tras la elección; en 'Uno en concreto', permitir selección múltiple de colores con botón de confirmación.",
        "confianza": 0.92,
        "razones": [
          "Opción A respeta la petición de 'momentos' separados: diálogo → opciones → reacción, sin solapamientos visuales que confundan a usuarias sénior en 375×667.",
          "Multi-color con confirmación (A en decisión 2) captura la intención real ('negro o marrón') y evita relajar el filtro, mejorando la precisión de las 6 recomendaciones.",
          "El guía que se retira y vuelve refuerza la sensación de atención personal sin trucos visuales (encogerse, quedar tapado) que rompen la ilusión de pie en el suelo.",
          "Ambas opciones elegidas son las preferidas por el usuario de la agencia y tienen coste de implementación bajo (fade in/out + multi-select estándar)."
        ],
        "riesgos": [
          "Si la animación de desvanecimiento del guía es lenta (>300 ms), se percibe lag en móviles antiguos.",
          "El botón 'Seguir' en multi-color añade un toque; debe ser grande (≥48 px) y estar fijo en zona segura para pulgar.",
          "Si no hay stock en los colores elegidos, el aviso del guía debe ser inmediato y claro para no frustrar."
        ],
        "cambiaria_si": "Tests de usabilidad con 5+ usuarias reales (50+, móvil) muestran confusión al volver el guía o errores frecuentes en multi-selección de color.",
        "alternativa": ""
      },
      "segundos": 145.6
    },
    {
      "modelo": "z-ai/glm-5.3",
      "ok": false,
      "respuesta": "",
      "segundos": 420.1
    }
  ]
}
```
