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
