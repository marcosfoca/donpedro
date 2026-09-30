# Consejo de decisión

## Caso

## Contexto
Landing gamificada de una zapatería familiar de Madrid (desde 1958). Público: mujeres de más de 50 años, en móvil. Un guía ilustrado (el fundador) hace 4 preguntas —ocasión (día a día, celebración, caminar, casa), tiempo (frío, entretiempo, calor), tacón (plano, bajo, alto) y color— y recomienda 6 zapatos reales del catálogo (611 productos, 188 modelos) en una cuadrícula de 2 × 3 a pantalla completa. Debajo hay "Más zapatos para usted" y un botón "Ver toda la tienda".

La pregunta de color acaba de cambiar a: Discretos / Llamativos / Cualquiera / Uno en concreto. "Uno en concreto" abre 12 muestras (negro, marrón, beige, blanco, gris, azul marino, burdeos, azul, rojo, rosa, verde, oro y plata) y se pueden marcar varias.

Regla de honestidad (innegociable): todo lo que el guía dice ("en verde", "planos", "en días de frío") es un filtro que EXCLUYE. Si faltan zapatos para llegar a 6 modelos distintos, el recomendador relaja filtros en un orden fijo y el guía lo dice en la misma frase: "Para su celebración, en días de frío, de poco tacón y en verde, yo le pondría estos (y alguno de otro color):". Lo que encaja de verdad sale siempre primero.

Orden actual de relajación (igual para todas las respuestas de color): 1) color → 2) tacón adyacente (plano↔bajo, bajo↔alto; nunca plano↔alto) → 3) temporada (admitir zapatos de otra temporada de las mismas categorías; se dice "de otra temporada") → 4) categorías de otras filas de la misma ocasión.

Datos medidos (27 combinaciones ocasión × tiempo × tacón, sin "casa"): cuántas veces hace falta relajar el color.
- Discretos 5/27 · Llamativos 11/27.
- Tonos sueltos: negro 7/27 · marrón 9/27 · beige 11/27 · azul 15/27 · burdeos 17/27 · azul marino 19/27 · blanco 25/27 · rosa 25/27 · oro y plata 25/27 · rojo 26/27 · verde 26/27 · gris 27/27.
Es decir, con un color poco habitual casi siempre salen 1–3 zapatos de ese color y el resto de otros colores (con aviso).

## Decisión
Cuando la clienta elige "Uno en concreto" (colores concretos), ¿en qué orden se relajan los filtros?

## Opciones
A) Mantener el orden actual también para "Uno en concreto": primero el color (la comodidad y la temporada se respetan; el color se completa con aviso). (La que hay ahora.)
B) Para "Uno en concreto": primero tacón adyacente → luego color → luego temporada → luego categorías. Protege algo más el color a costa de un tacón parecido.
C) Para "Uno en concreto": primero categorías de otras filas de la misma ocasión SIN admitir fuera de temporada (otros tipos de zapato que sirven para ese tiempo) → tacón adyacente → color → temporada al final.
D) No completar hasta 6 con otros colores: enseñar solo los que son de su color (aunque sean 1–3), que el guía lo diga ("de verde solo tengo estos") y que el resto aparezca en "Más zapatos para usted".

## Criterios (en orden)
1. Confianza y honestidad: que lo que dice el guía se cumpla y que la clienta no sienta que no se la ha escuchado.
2. Conversión: que lo que ve le guste lo bastante para entrar en la ficha y comprar.
3. Comodidad (el dolor principal del público es que los zapatos hagan daño; el tacón pesa mucho) y adecuación al tiempo (nada de sandalias con frío).
4. Coherencia visual (la cuadrícula de 6 a pantalla completa es un patrón aprobado).
5. Coste de implementación y de pruebas.

## Restricciones
- Cada relajación se anuncia en la frase del guía; nunca se enseña algo que contradiga lo dicho sin aviso.
- Nunca tacón alto a quien pidió plano (ni al revés). Nunca calzado abierto con frío.
- Sin urgencia ni escasez inventadas.


## Consejo

```json
{
  "resumen": {
    "votos": {
      "B": 1,
      "C": 1
    },
    "mayoria": "B",
    "unanime": false,
    "confianza_media": 0.8
  },
  "opiniones": [
    {
      "modelo": "moonshotai/kimi-k3",
      "ok": true,
      "respuesta": {
        "opcion": "B",
        "recomendacion": "Para 'Uno en concreto', relajar primero el tacón adyacente y luego el color, manteniendo temporada y categorías después: la clienta que pide un color concreto ve su color en casi toda la cuadrícula.",
        "confianza": 0.75,
        "razones": [
          "Elegir un color concreto es la señal más explícita de deseo: con el orden actual, en colores poco habituales (25-27/27) casi siempre salen 3-5 zapatos de otro color, y la clienta siente que no se la ha escuchado (criterio 1).",
          "El tacón adyacente (plano↔bajo) es una desviación pequeña, permitida por las restricciones y anunciable ('de tacón bajo, casi plano'); duele menos que ver la cuadrícula llena de colores que no pidió.",
          "Conversión: 6 zapatos de su color con tacón parecido tienen más probabilidad de clic que 2 de su color y 4 de otro.",
          "Temporada y categorías quedan protegidas igual que ahora, cumpliendo comodidad climática y las restricciones."
        ],
        "riesgos": [
          "En combinaciones escasas puede salir tacón bajo a quien pidió plano; si el público lo percibe como incómodo, baja confianza pese al aviso.",
          "Más combinaciones de frases del guía que redactar y probar (dos órdenes de relajación distintos).",
          "Si el tacón adyacente tampoco llena, se acumulan dos avisos en una frase y puede sonar confusa."
        ],
        "cambiaria_si": "Datos de que el tacón adyacente reduce clics o devoluciones más que el color mezclado, o tests mostrando que la clienta tolera mejor 'otro color' que 'otro tacón'.",
        "alternativa": "Híbrido: si tras relajar tacón adyacente hay al menos 4 de su color, completar con color; si no, ofrecer '¿prefiere ver más colores o un tacón parecido?' como micro-pregunta del guía, evitando decidir por ella."
      },
      "segundos": 171.0
    },
    {
      "modelo": "nvidia/nemotron-3-ultra-550b-a55b",
      "ok": true,
      "respuesta": {
        "opcion": "C",
        "recomendacion": "Para 'Uno en concreto', relajar primero categorías de la misma ocasión y temporada → luego tacón adyacente → luego color → por último temporada.",
        "confianza": 0.85,
        "razones": [
          "Protege la elección de color explícita (señal de alta intención) hasta la 3ª relajación, cumpliendo criterio 1 (confianza/honestidad).",
          "Protege el tacón (dolor principal del público) hasta la 2ª relajación, respetando criterio 3 (comodidad).",
          "Mantiene la cuadrícula de 6 y la coherencia visual (criterio 4) sin inventar escasez ni romper promesas.",
          "La 1ª relajación (otras categorías misma ocasión/temporada/tacón/color) descubre modelos relevantes sin traicionar filtros clave."
        ],
        "riesgos": [
          "Relajar categorías primero puede mostrar tipos de zapato inesperados (ej. botines en vez de sneakers) y confundir si no se explica bien.",
          "Aumenta complejidad lógica y de testing al tener dos órdenes de relajación según modo de color.",
          "Para colores muy raros (verde, rojo, gris) seguirá haciendo falta relajar color en la mayoría de combinaciones (datos: 26/27)."
        ],
        "cambiaria_si": "Tests de usabilidad con 5+ usuarias reales mostraran que la relajación de categorías genera rechazo o incomprensión mayor que ver colores distintos con aviso honesto.",
        "alternativa": "D (no completar a 6): mostrar solo los 1–3 exactos con frase honesta ('de verde solo tengo estos') y derivar el resto a 'Más zapatos para usted'; más honesto y simple, pero rompe el patrón de cuadrícula aprobado y puede bajar conversión por huecos visuales."
      },
      "segundos": 179.9
    },
    {
      "modelo": "z-ai/glm-5.3",
      "ok": false,
      "respuesta": "",
      "segundos": 420.0
    }
  ]
}
```
