# QA móvil — "Don Pedro le atiende"

2026-09-29 · qa-movil · Next 15.5.26, Node 18.20.5, Edge 154 headless vía CDP (sin instalar nada).
Capturas y scripts: scratchpad de la sesión, carpeta `qa/` (64 PNG; recorridos `m375-*` noche y `m390-*` día, `rm375-*` con reduced-motion, errores, peor cabecera y foco de teclado).

## Veredicto
**Apto para preview.**
- **Comprobaciones:** tsc 0 errores · 164/164 tests · build OK (First Load JS 152 kB) · 0 excepciones en consola (solo el 404 de favicon).
- **Flujo:** coincide con el guion, incluidas la regla "casa", "Atrás", el reinicio, el error de catálogo y el usuario que vuelve.
- **Tracking:** correcto, un disparo por evento.
- **Seguridad:** la clave no aparece en `out/` ni en el código.
- **Pendiente:** dos fallos altos antes de publicar.

## Rendimiento (4G simulado, CPU ×4, 375×667)
- **Día:** la fachada se pinta a unos 2,5 s y el CTA es interactivo a 3,0 s. Se transfieren unos 510 kB.
- **Noche:** primero se pinta la fachada de día y después la de noche, a 4,6 s. Se transfieren 694 kB.
- **Catálogo:** va en el chunk inicial (301 kB de JSON), con una tarea larga de 650–890 ms.

## Accesibilidad
- Zonas táctiles ≥ 48 px y alt en todas las imágenes: OK.
- Recorrido completo con teclado: OK.
- aria-pressed y aria-live: OK.
- Contraste de los tokens: OK.
- **Excepción:** el título y la promesa de la fachada de día no llegan al contraste mínimo (ver A-1).

## Fallos
### Alto
- **A-1. Contraste del título y la promesa sobre el cielo de día.** Título 2,7–3,1:1 y subtítulo 2,0–2,6:1. Además, el subtítulo baja a 17 px en pantallas bajas. Propuesta: velo más oscuro de día o cartela crema con texto en tinta, y mínimo 18 px.
- **A-2. R2 con línea de relajación** (34/112 combinaciones). La cabecera mide 225 px, la foto se queda en **54 px** y la última fila sale del viewport a 375×667. Sin relajación, la foto mide 74 px. Propuesta: sacar la relajación de la burbuja y compactar la tarjeta.

### Medio
- **M-1. De noche se descarga la fachada de día** y se ve hasta que hidrata (+184 kB). Propuesta: decidir el momento con un script en línea antes de pintar.
- **M-2. Catálogo en el chunk inicial.** Propuesta: `import()` diferido del recomendador y quitar `descripcion` del JSON del cliente.

### Bajo
- **B-1.** Al recargar a mitad de recorrido se ve la fachada inerte unos 2,3 s.
- **B-2.** El hover se queda pegado en táctil (`hoverOnlyWhenSupported`).
- **B-3.** El anillo de foco marino se pierde sobre el cielo nocturno.
- **B-4.** Falta el favicon.
- **B-5.** Sin AVIF; la campanilla en WAV pesa 124 kB.
- **B-6.** Precarga de la pose de saludo, los iconos de Q1 y la pose de trastienda.
- **B-7.** `recomendaciones_vistas` se repite al recargar.
- **B-8.** Etiquetas escritas a mano en el código; no se usa `textos.entrada.etiqueta`.
- **B-9.** Tamaños por debajo de 18 px en R1, en la relajación y en el tachado.
- **B-10.** Falta `serve` en devDependencies y un `.vercelignore`. **Revocar la clave.**
- **B-11.** aria-live montado con el contenido ya dentro, `<main>` sin nombre y sin h1 por escena, y la puerta antes que el CTA en el orden de tabulación.

## Desviaciones del guion que hay que ratificar
Fachada de día o de noche; botón Sonido oculto en R; nombre oculto en la tarjeta móvil; tarjeta mínima de 150 px; reacciones acortadas; enlace a Cookies en el pie.

## Dato para el cliente
En 254 de los 611 productos, el slug de la URL de PrestaShop indica otro color que el nombre (SEO de su tienda).
