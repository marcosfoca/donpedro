# Auditoría de persuasión — "Don Pedro le atiende"

2026-09-29 · auditor-persuasion (solo lectura) · contrato: diseno.md §1–§3, narrativa.md, estado.md, references/persuasion.md.

## Resumen
1. El guion persuasivo está construido casi entero y es honesto: precios visibles, reseñas literales, pacto veraz y sin urgencia. Fallan dos cosas: la personalización se contradice en un recorrido y el dolor apenas llega a leerse.
2. **Crítico:** con "celebración + frío/entretiempo" pueden salir **sandalias de fiesta** bajo "con frío…". Motivo: vestir está etiquetado como de todo el año, "FORRO/ANTE" añaden frío y la estación no excluye.
3. **Dolor:** las reacciones de Q1 y Q3 se ven 1,2 s, ilegibles para un público sénior. Faltan la empatía del guía (SB7), la agitación del "armario" y el taller.
4. **Conversión:**
   - El pacto y las reseñas quedan fuera del primer pantallazo.
   - "Comprar" lleva a una ficha con la talla 35 preseleccionada sin ningún puente.
   - Al volver de la ficha se ve la fachada un instante y se pierde la posición.
5. **Otros:** 5 medios y 9 bajos.

## Por pantalla
| Pantalla | Estado | Nota |
|---|---|---|
| F Fachada | OK | Promesa, 1958, CTA sobre el pliegue, puerta táctil. El pie con "Tienda" aparece al desplazarse (B3) |
| T Entrada | OK | |
| S Saludo | PARCIAL | Sin empatía con el dolor interno; el taller no aparece |
| Q1 | PARCIAL | Reacción de 1,2 s (A1); "lo tengo en cuenta" sin respaldo (M2) |
| Q2 | OK | Afectada por C1 |
| Q3 | PARCIAL | 1,2 s (A1); falta la agitación del armario (A2) |
| Q4 | OK | |
| E | OK | |
| R1 | PARCIAL | Línea de relajación imprecisa (M1) |
| R2 | FALLA | C1, M3, M4, A3 |
| R2b | PARCIAL | Bajo el pliegue (A4); calla el coste de devolución (M5) |
| R3 | OK | Marco sin pared (B4) |
| R4 | PARCIAL | "Ver toda la tienda" lleva a una categoría (B2); tandas perdidas al volver (A5) |
| R5 | OK | Sin despedida (B5) |
| Volver de la ficha | FALLA | A5 |

Bucles 1 y 2: OK. Último bucle cerrado con la conversión: FALLA (A3).
Recorrido del dolor: reconocimiento PARCIAL · agitación FALLA · solución OK.
Límites éticos: OK, salvo la personalización (PARCIAL por C1, M1 y M2).

## Hallazgos
### Crítico
- **C1. Sandalias recomendadas "con frío".**
  - Dónde: `lib/etiquetado.ts` (vestir de todo el año; FORRO/ANTE añaden frío) y `lib/recomendador.ts` (la estación solo suma +1).
  - Propuesta: SANDALIA → solo calor (o entretiempo+calor) sea cual sea la categoría; una estación que no coincide excluye, con relajación anunciada; ampliar el test de honestidad a la estación.

### Alto
- **A1. Reacciones de 1,2 s.** Propuesta: duración proporcional al texto (≈280 ms por palabra, mínimo 2,2 s) y que tocar la pantalla avance antes.
- **A2. Falta la empatía del guía, la agitación y el taller.** Copy propuesto:
  - S1: "¡{saludo}! Pase, pase. Comprar sin probarse da respeto, ya lo sé."
  - S2: "…con el taller de siempre" (confirmar con el cliente que el taller sigue).
  - E: "…a por los que no se quedan en el armario."
- **A3. Sin puente a la ficha (talla 35 preseleccionada).** Propuesta: segunda línea en R1: "Toque el que le guste y, en la ficha, fíjese bien en su talla."
- **A4. Pacto y reseñas fuera del primer pantallazo.** Propuesta: dejar asomar el pacto en pantallas de 740 px de alto o más.
- **A5. Al volver de la ficha se ve la fachada un instante y se pierde la posición.** Propuesta:
  - Script previo a la hidratación que oculte la fachada si hay estado guardado.
  - No hacer scroll al hidratar.
  - Guardar las tandas visibles y la posición de scroll.

### Medio
- **M1. Relajación imprecisa.** Propuesta: "…alguno de otro color / con un poquito de tacón / de otra temporada".
- **M2. "Lo tengo en cuenta" sin respaldo.** Propuesta: cambiar el copy ("Y muchas horas de pie, ya lo sé.") o penalizar ESTILETO/PLATAFORMA en celebración.
- **M3. Deduplicado roto por erratas del catálogo** ("ALTO ALTO", "TIRAS TIRAS"). Propuesta: colapsar palabras repetidas en `calcularModelo`.
- **M4. Tarjeta de móvil sin nombre ni porqué.** Propuesta: una etiqueta de una línea tipo "Salón · tacón bajo".
- **M5. Costes de envío y devolución no mencionados.** Propuesta: "Si lo devuelve, la recogida cuesta 12 €, salvo defecto." Decisión del cliente.

### Bajo
- **B1.** Desempate por precio descendente.
- **B2.** "Ver toda la tienda" → "Ver todos los {categoría}".
- **B3.** "Tienda" en el pie desde F y Q.
- **B4.** R sin fondo; tarjetas sin revelado escalonado.
- **B5.** Sin despedida de Don Pedro.
- **B6.** El error de foto no lo dice Don Pedro.
- **B7.** "con" repetido en R1.
- **B8.** No se pueden cambiar respuestas sueltas desde R.
- **B9.** "Cuatro preguntas" cuando con "casa" son 2 (inofensivo).

## Lo que funciona (no romper)
Honestidad comercial, personalización basada en respuestas reales, test de honestidad de color y tacón, una decisión por pantalla, "Atrás" que conserva las respuestas, progreso dotado, error dicho por Don Pedro, `urlTienda()` como único punto de salida y voz de usted constante.
