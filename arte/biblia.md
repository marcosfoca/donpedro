# Biblia visual — "Don Pedro le atiende"

> Fijada el 2026-09-29 tras elegir el **estilo 2, cartel de época**. TODA generación parte de esta biblia y de sus imágenes de referencia.

## Herramienta
- `scripts/arte/generar.py`, variante local del script de la skill con `--aspecto` y `--modelo`.
- Modelo por defecto: **gemini-3-pro-image**. Para iconos pequeños se puede usar `gemini-3.1-flash-image` si el resultado aguanta.
- Clave en `.env.local` (`GEMINI_API_KEY`), fuera de git. Carga: `set -a; . ./.env.local; set +a`.

## Prompt base de estilo (pegar al principio de cada prompt)
```
Clean-line mid-century Spanish commercial poster illustration (generic 1950s-60s shop advertising look, not imitating any specific artist): thin dark ink outlines (#2B2118), flat colour areas with minimal soft shading, subtle printed paper grain over the whole image, warm and elegant, respectful. Palette: leather brown #816040, cream #F1E6B2, gold #CEB888, navy #2E4674, warm off-white #FBF7EA, ink #2B2118, small accents of muted red #B5553C.
```

## Referencias de estilo obligatorias
- `arte/aprobado/fachada-dia.png`: estilo, trazo, grano y paleta.
- `arte/aprobado/fachada-noche.png`: la misma escena con luz nocturna.
- Personaje: `arte/aprobado/don-pedro-hoja.png`: chaleco marrón, camisa arremangada, cinta métrica amarilla al cuello, gafas redondas en la punta de la nariz, bigote gris.

## Reglas
- **Trazo:** tinta fina y uniforme, sin contornos gruesos de cómic. Líneas rectas limpias en la arquitectura.
- **Color:** colores planos con sombreado mínimo. Sin degradados fotográficos. El grano de impresión es sutil y homogéneo.
- **Luz:**
  - Día y tarde: dorada y cálida.
  - Noche: cielo azul marino con estrellas pequeñas y el interior con luz amarilla cálida.
  - Interior de la tienda: luz cálida en cualquier caso.
- **Encuadre:**
  - Escenas en vertical 9:16 (móvil) con vista frontal.
  - Hay que dejar zonas libres donde irá la interfaz: cielo en la fachada, y el tercio inferior en el interior para las tarjetas.
- **Texto:** el único texto permitido es el de la fachada: "Don Pedro", "CASA FUNDADA EN 1958" y "Zapatos - Bolsos - Complementos". En el resto de imágenes no puede aparecer ningún texto.
- **Zapatos y bolsos ilustrados:** son genéricos y decorativos. **Nunca** se presentan como producto de la tienda; los productos se muestran siempre con sus fotos reales.
- **Sprites** (Don Pedro, iconos): se generan sobre fondo croma `#00FF00` y el fondo se quita con `postproceso.py fondo`. Si el sujeto tiene verde, se usa `#FF00FF`.

## Evitar
Estilos protegidos de terceros (Pixar, Ghibli, Hergé…), anime, 3D, fotorrealismo, neón, degradados brillantes, personas en la fachada, cámaras de seguridad, extintores y carteles, y texto inventado.

## Atmósfera y emoción por escena
| Escena | Luz y temperatura | Ritmo | Emoción |
|---|---|---|---|
| F Fachada | Tarde dorada, o noche con el escaparate encendido (según la hora) | Quieto, con aire | Calidez, orgullo de barrio, curiosidad |
| T Entrada | Del exterior a la luz cálida del interior | Avance suave | Invitación |
| S, Q, E Interior | Cálida y uniforme, madera y crema | Pausado | Acogida, oficio, orden |
| Don Pedro | Iluminado de frente, sin sombras duras | Gestos claros y legibles en tamaño pequeño | Cercanía, galantería, humor suave |
| R Resultados | Fondo crema liso (las fotos reales mandan) | — | Confianza |
