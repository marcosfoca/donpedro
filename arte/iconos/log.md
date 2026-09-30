# Log — Iconos del quiz (A9–A12) y progreso (A14)

## r01 (2026-09-29) — rejilla 4×4 sobre croma magenta, 2K
- Ref: arte/aprobado/fachada-dia.png. Se usa magenta porque la muestra "con color" lleva verde. Prohibidos el rosa, el magenta y el morado en los iconos.
- 01 ✅ (02 mete celdas con fondo crema). En la 01 el magenta varía de tono entre celdas → `limpiar_croma.py --croma magenta --tol 90`.
- Orden: q1 diario, celebración, caminar, casa · q2 frío, entretiempo, calor · q3 plano, bajo, tacón · q4 oscuros, claros, color, todos · progreso vacío (solo contorno) y lleno.
- Aprobado: `arte/aprobado/iconos/*.png` → `public/arte/iconos/*.webp` (256px) y `public/arte/progreso-*.webp`.

## A13 marco de reseñas
- Hecho con CSS (moldura dorada + filetes de tinta + paspartú): una imagen estirada deformaría las esquinas.

## A15 campanilla
- Sintetizada: `scripts/arte/campanilla.py` → `public/sonido/campanilla.wav` (1,4 s). Sin muestras de terceros.
