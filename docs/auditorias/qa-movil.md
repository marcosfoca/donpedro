# QA móvil: "Don Pedro le atiende" (relanzamiento, 2026-09-30)

- **Qué se probó:** `out/` compilado a las 13:58, servido en local.
- **Herramientas:** Playwright con Chrome headless en modo móvil táctil.
- **Tamaños:** 375×667 (completo, ruta larga y ruta "casa"); comprobación rápida a 360×640, 390×844 y 375×553 (el alto útil real de un iPhone SE).
- **Capturas y scripts:** en el scratchpad de la sesión (`qa/`).

## Veredicto
**Apto con reservas.** A 375×667 el flujo cumple el guion, sin errores de consola ni respuestas 404 propias.

## Crítico
- **C-1. La URL publicada daba 404.** ✅ Resuelto el mismo día:
  - El proyecto de Vercel, conectado a GitHub, compilaba con el preset "Other" y servía `public/`. Arreglo: `vercel.json` con `npm run build` y `out/`.
  - `.vercelignore` excluía también `public/arte/`. Arreglo: reglas ancladas a la raíz.
  - Verificado en https://donpedro.howstudio.es.

## Importantes
- **I-1. La reacción sale fuera de la vista.** Pasa tras "Seguir", o tras elegir, si la página estaba desplazada. `app/page.tsx` solo sube la página al cambiar de fase. Arreglo: `scrollTo(0)` al entrar en los momentos de diálogo (`escenas/Pregunta.tsx`).
- **I-2. Con 640 px de alto o menos, Q4 y las muestras no caben:**
  - "Atrás" y "Seguir" quedan de 9 a 31 px por debajo.
  - A 375×553, filas cortadas.
  - Arreglo: pie `sticky` con pastilla y tamaños compactos con `max-height: 700px`.
- **I-3. El resumen largo tapaba la cabeza de Don Pedro** (hasta 5 líneas). ✅ Resuelto con el resumen en frases de 55 caracteres o menos (auditoría de voz).
- **I-4. El foco de teclado se pierde en el quiz** y el siguiente Tab sale al pie. Arreglo: enfocar la primera opción al salir las opciones y el cuadro durante la reacción.

## Menores
- **M-1.** Con `prefers-reduced-motion` no hay fundidos: falta `@keyframes fundido` en el CSS compilado.
- **M-2.** "Saltar" y "Atrás" no tienen pastilla porque `bg-transparent` la anula. Contraste de "Saltar" con mediana de 4,58:1.
- **M-3.** Textos de menos de 18 px: etiqueta de la tarjeta (15), nombres en "Más zapatos" (16), precio tachado (15) y dirección de la fachada (15).
- **M-4.** Tarjetas de la misma fila con altos distintos. Arreglo: `h-full`.
- **M-5.** Las regiones `aria-live` nacen con el texto dentro y algunos lectores no las leen. Arreglo: una región viva que no se desmonte.
- **M-6.** A 375×553 las 6 recomendaciones no caben en una pantalla.
- **M-7.** Fotos que no coinciden con el color del nombre: id 703 (botín "negro" que es gris) e id 2774 ("Padme negro/oro", burdeos). Van a `content/etiquetas-manuales.ts`.
- **M-8.** La 404 precarga la fachada sin usarla.
- **M-9.** Sin AVIF; la campanilla es un WAV de 124 kB (solo se descarga si se activa el sonido).
- **M-10.** Tracking:
  - "Ir a la tienda" del error no dispara `ver_tienda_click`.
  - `mas_zapatos_click` ya no existe.

## Qué funciona
- **Flujo completo:** saludo, quiz por momentos con efectos, muestras de color, trastienda con resumen y pacto, resultados con título, 6 tarjetas, 30 más y un solo botón.
- **Ruta "casa":** en femenino.
- **Don Pedro:** de pie en el suelo.
- **Accesibilidad:** zonas táctiles de 48 px o más y foco doble visible.
- **Rendimiento (4G lento):** LCP de 0,65–0,94 s y 535 kB transferidos.
- **Vuelta desde la ficha y recarga:** restauran bien.
- **Seguridad:** no aparece ningún secreto en `out/`.
