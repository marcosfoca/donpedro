# Log — Don Pedro (hoja de personaje → poses A4–A8)

## r01 (2026-09-29) — hoja de personaje; el eje que cambia es la ropa
- Modelo gemini-3-pro-image, 16:9. Ref: arte/aprobado/fachada-dia.png (estilo). Prompt: prompt base de biblia.md + descripción del personaje (≈65 años, bigote gris, gafas redondas en la punta de la nariz, caricatura tierna) + hoja con vistas de frente, tres cuartos y perfil, y 4 expresiones (saludo, escuchando, risa, señalando). Variaciones en `r01-variaciones.txt`.
- 01 chaleco marrón y camisa arremangada · 02 bata crema y corbata marino · 03 rebeca crema y pajarita · 04 delantal de cuero de zapatero y chaleco marino.
- Autorrevisión: las 4 coherentes entre vistas, sin texto y con la cara constante. 02 y 04 tienen el trazo más cercano al cartel; 01 es algo más suave.
- Feedback: _pendiente_

Feedback r01: **1 (chaleco marrón)** elegido → `arte/aprobado/don-pedro-hoja.png`.

## r02-poses — rejilla 3×2 sobre croma #00FF00, medio cuerpo
- Ref: arte/aprobado/don-pedro-hoja.png. Poses: saludo · escuchando · contento (pulgar arriba) · trastienda (cajas) · señalando · apurado (se rasca la cabeza; nueva, para la pantalla de error).
- 01 ✅ (02 tiene las figuras cortadas por los bordes de las celdas).
- Postproceso: `postproceso.py fondo` dejaba un halo verde → nuevo `scripts/arte/limpiar_croma.py` (alfa por verdosidad + despill + erosión de 1 px) → `rejilla --cols 3 --filas 2` → `recortar --margen 6`. Revisado sobre fondo crema y marino: sin halo, salvo un resto mínimo entre los dedos de "saludo".
- Aprobado (provisional, pendiente del visto bueno del usuario): `arte/aprobado/don-pedro/*.png`

## r03-cuerpo (2026-09-30) — cuerpo entero (petición del usuario: "ponle piernas, de cuerpo entero detrás del diálogo")
- Rejilla 3×2 en 2:3 a 2K sobre croma verde; refs: hoja aprobada + pose de saludo de medio cuerpo.
- 02 ✅ (la 01 trae líneas de rejilla negras). Las figuras no caen en tercios exactos → `scripts/arte/separar_figuras.py` (corta por franjas vacías; `--hueco 1` porque la mano de "señalando" roza a "apurado").
- Limpieza: `limpiar_croma.py` + neutralizado de la franja oliva. Aprobado: `arte/aprobado/don-pedro/*.png` (las de medio cuerpo, archivadas en `arte/aprobado/don-pedro-medio-cuerpo/`). Web: `public/arte/don-pedro/*.webp` (~1000 px de alto).
