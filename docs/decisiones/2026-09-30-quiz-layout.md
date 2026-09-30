# Consejo de decisión

## Caso

## Contexto
Landing gamificada para una zapatería familiar de Madrid (desde 1958). Público: mujeres de más de 50 años, en móvil (diseñamos para 375×667). Un personaje guía ilustrado (el fundador, caricatura tierna) hace 4 preguntas de un quiz y luego recomienda 6 zapatos. El usuario de la agencia ha pedido que el guía aparezca de cuerpo entero (con piernas), de pie, detrás del cuadro de diálogo, y sin velos sobre el fondo ilustrado de la tienda.

## Decisión
¿Cómo maquetamos cada pantalla de pregunta (Q1–Q4) en 375×667? Contenido: barra de progreso (48 px), el guía, su frase (pregunta o reacción de 1-2 líneas, ~70 px), 3 o 4 tarjetas de respuesta (2×2 de 140 px de alto, o 3 en columna de 88 px) y un botón "Atrás" (48 px).

## Opciones
A) Guía de cuerpo entero de 32% del alto de pantalla (≈213 px) centrado arriba; el cuadro de diálogo empieza a la altura de la cintura y tapa sus piernas; tarjetas debajo. Cabe sin scroll, pero las piernas casi no se ven.
B) Guía de cuerpo entero más pequeño (≈180 px) con el cuadro de diálogo a la altura de las rodillas, para que se vean las piernas; tarjetas más compactas (2×2 de 120 px). Cabe justo sin scroll.
C) Guía de cuerpo entero a la derecha (≈260 px) y el cuadro de diálogo a su izquierda superpuesto a su costado; tarjetas debajo; requiere scroll corto en Q1/Q4 (≈40 px).
D) En las preguntas, guía solo de medio cuerpo en miniatura junto al diálogo (como antes), y el cuerpo entero reservado para saludo, espera y resultado.

## Criterios (en orden)
1. Que la usuaria vea y toque las respuestas sin scroll ni confusión (claridad sénior).
2. Cumplir lo pedido por el usuario de la agencia (cuerpo entero, detrás del diálogo).
3. Sensación de estar atendida por el personaje (intimidad parasocial).
4. Coste de implementación bajo.

## Restricciones
- Zonas táctiles de al menos 48 px, textos de al menos 18 px.
- Sin velos sobre el fondo; el personaje no puede tapar las respuestas.


## Consejo

```json
{
  "resumen": {
    "votos": {
      "A": 1,
      "B": 1
    },
    "mayoria": "A",
    "unanime": false,
    "confianza_media": 0.84
  },
  "opiniones": [
    {
      "modelo": "moonshotai/kimi-k3",
      "ok": false,
      "respuesta": "error: The read operation timed out",
      "segundos": 120.3
    },
    {
      "modelo": "nvidia/nemotron-3-ultra-550b-a55b",
      "ok": true,
      "respuesta": {
        "opcion": "A",
        "recomendacion": "Usar Opción A: guía 213 px centrado arriba, diálogo a altura de cintura tapando piernas, tarjetas 2×2 de 140 px; garantiza cero scroll y targets amplios para sénior.",
        "confianza": 0.9,
        "razones": [
          "Cumple criterio 1 (claridad sénior) sin scroll ni tarjetas compactas",
          "Cumple criterio 2 literal: cuerpo entero detrás del diálogo sin velos",
          "Coste bajo y maquetación simple (stack vertical)",
          "Evita riesgo de error táctil de tarjetas de 120 px (Opción B)"
        ],
        "riesgos": [
          "Piernas del guía apenas visibles (diálogo las tapa)",
          "Menos impacto visual de 'cuerpo entero' que en B/C",
          "Diálogo flotante puede parecer 'mostrador' y no 'burbuja'"
        ],
        "cambiaria_si": "Si el cliente insiste en que las piernas deben verse claramente y acepta testear usabilidad de tarjetas 120 px con usuarias reales.",
        "alternativa": "Guía 180 px (hasta rodillas), diálogo a esa altura, tarjetas 2×2 de 140 px estándar: cabe en 626 px, sin scroll, piernas visibles, targets cómodos."
      },
      "segundos": 160.5
    },
    {
      "modelo": "z-ai/glm-5.3",
      "ok": true,
      "respuesta": {
        "opcion": "B",
        "recomendacion": "Maqueta B: guía completo de ~180-190 px con las piernas visibles y el cuadro a la altura de las rodillas; usa el margen sobrante para no sacrificar tamaño de tarjetas.",
        "confianza": 0.78,
        "razones": [
          "Cumple literalmente el encargo (cuerpo entero CON piernas, detrás del diálogo): A esconde las piernas y D las elimina, con alto riesgo de ronda de revisiones del cliente.",
          "Cabe sin scroll con holgura real (~600 px de 667): las tarjetas de 120 px casi triplican el mínimo táctil de 48 px y admiten texto de 18 px; C rompe el criterio 1 con scroll y D el criterio 2.",
          "La figura de pie y completa refuerza la sensación de 'te está atendiendo en la tienda' mejor que un torso asomando tras el cuadro (A) o una miniatura (D).",
          "Coste igual que A: mismo layout vertical, solo cambian la escala del personaje y la altura del cuadro."
        ],
        "riesgos": [
          "A 180 px la cara queda pequeña (~30 px): verificar que la caricatura siga leyéndose tierna; si no, subir el guía a ~200 px con el margen disponible.",
          "'Cabe justo': frases de reacción de 2 líneas o labels largos pueden forzar scroll; fijar máximo de caracteres y probar en 375×667 real.",
          "El cuadro a la altura de las rodillas puede tapar manos o cinturón del arte: pedir al ilustrador pose con brazos arriba o arte adaptable."
        ],
        "cambiaria_si": "Un test en dispositivo real donde B desborde a scroll, o donde el guía de 180 px no se perciba como personaje y el cliente ceda en ver las piernas: entonces A con el cuadro subido al pecho.",
        "alternativa": "B con tarjetas de 130-140 px en vez de 120 px: la suma (48+180+~20 de cuadro+280+48 ≈ 616 px con gaps) sigue cabiendo sin scroll, así no se sacrifican las tarjetas."
      },
      "segundos": 306.4
    }
  ]
}
```
