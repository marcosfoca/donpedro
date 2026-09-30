# Log — A1 Fachada (también sirve como ronda de estilo)

## r01 (2026-09-29) — una variante por dirección de estilo
- Modelo: gemini-2.5-flash-image (por defecto del script). Referencia: arte/referencias/blog-don-pedro.png
- Prompt base y variaciones: `arte/fachada/r01-variaciones.txt` + el prompt de la llamada (fachada fiel a la referencia, sin cámara/alarma/extintor, 9:16, 40 % superior de cielo vacío, paleta de marca, sin personas, sin más texto que el rótulo y el toldo).
- Resultado: 01 gouache · 02 cartel de época · 03 acuarela · 04 cartel + luz dorada.
- Autorrevisión: rótulos legibles en las 4. Fallos comunes: salen cuadradas (no 9:16) y 01–03 casi sin cielo. 02 conserva el extintor. 04 tiene cielo, pero la fachada queda pequeña y la luz dorada no llega.
- Feedback: _pendiente_

Feedback r01: **estilo 2 (cartel de época)** elegido por el usuario.

## r02 (2026-09-29) — estilo 2, vertical 9:16, frontal, puerta cerrada, cielo libre
- Modelo: **gemini-3-pro-image** con `scripts/arte/generar.py --aspecto 9:16` (768×1376). Refs: r01/02.png (estilo) + referencias/blog-don-pedro.png (fachada).
- Prompt: la llamada + `r02-variaciones.txt`. El eje que cambia es el cielo y la luz: 01 azul · 02 dorado · 03 azul con más grano · 04 noche azul marino con el escaparate iluminado.
- Autorrevisión: las 4 verticales y con el cielo libre (~40 %), rótulo y toldo legibles. 01 y 03 conservan algo de perspectiva. 02 y 04 son las más frontales y con la puerta cerrada. **En todas persiste un extintor pequeño** abajo a la derecha del escaparate: se corrige con una edición. 02 trae un marco crema alrededor (no llega a sangre).
- Feedback: _pendiente_

Feedback r02: **2 + 4 según la hora** (día y tarde = dorada, noche = azul marino).

## r03 (ediciones sobre r02/02 y r02/04)
- Día: "quitar el marco crema → a sangre" y "quitar el extintor" → **r03-dia/01 ✅** (02 conserva el marco).
- Noche: quitar el extintor → correcto, pero la composición es distinta de la de día (mala para la geometría de la puerta).

## r04-noche (noche generada a partir del día)
- Refs: r03-dia/01 (composición) + r03-noche/01 (luz). "Misma composición alineada al píxel; solo cambian el cielo y la luz."
- **02 ✅** (escaparate más cálido). Alineación medida con perfiles de bordes: desfase 0 px horizontal y 0 px vertical frente al día.

## Aprobado
- `arte/aprobado/fachada-dia.png` ← r03-dia/01.png
- `arte/aprobado/fachada-noche.png` ← r04-noche/02.png

## r05/r06 — escritorio 16:9 (outpaint del día + noche alineada)
- r05-escritorio-dia/02 ✅ (la 01 no deja cielo). r06-escritorio-noche/01 ✅ (desfase 0/0 frente al día).
- Aprobado: `arte/aprobado/fachada-{dia,noche}-escritorio.png`.

## Hoja de la puerta (A2)
- Recortada de cada fachada: móvil x 404–560, y 796–1200 (768×1376); escritorio x 700–797, y 448–692 (1376×768). Medido con perfiles de píxeles marrones del marco.
- **Bisagras a la derecha** (el tirador está a la izquierda): la animación gira desde `right center` con −82°.
- Exportado a `public/arte/fachada/*.webp`.
