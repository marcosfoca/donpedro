# Auditoría de voz: "Don Pedro le atiende" (relanzamiento)

2026-09-30 · auditor-voz (solo lectura) · biblia: `docs/diseno.md` §1–2, `narrativa.md`, `patrones.md`.

## Veredicto
**La voz está bien; la medida, no.**
- Don Pedro trata de usted en el 100 % de los textos.
- No aparece ningún término del vocabulario prohibido (buscado en `content/`, `components/`, `escenas/`, `app/` y en los nombres del catálogo).
- El pacto no promete que devolver sea gratis, no hay urgencia y los errores y el 404 los dice Don Pedro dentro de la tienda.

**Lo que falla:**
- La frase de conversión (el resumen de la trastienda) ocupa de 3 a 6 líneas en un cuadro pensado para 2.
- Se encadenan 6 frases sin que la clienta actúe.
- La rama "casa" no nombra nunca las zapatillas.

**Recuento:** 1 crítico · 4 importantes · 12 menores.

Medida: el texto del cuadro mide 299 px en Vollkorn de 20 px, unas 31 letras por línea. Dos líneas son como mucho unos **55 caracteres**.

## Hallazgos

### Crítico
**C1. El resumen no cabe y habla sin referente.**
- Mide de 74 a 148 caracteres (de 3 a 6 líneas).
- El paréntesis de la relajación no se puede decir en voz alta.
- "estos/estas" no señala nada, porque los zapatos aún no se ven.

Propuesta: 2 frases (≤ 55) y una tercera solo si hubo relajación.

### Importantes
- **I1. Racha de 6 frases sin que la clienta actúe:** reacción de Q4, espera (2), resumen y pacto (2).
  - Opción A: el pacto como respuesta a un botón "¿Y si no me quedan bien?".
  - Opción B: pacto en 1 frase.
  - Es decisión del usuario.
- **I2. La rama "casa" no nombra las zapatillas.** Dice "estas", "se las prueba" y "Ver los zapatos". Faltan "Ver las zapatillas", "Más zapatillas para usted" y la etiqueta de sección.
- **I3. Dos frases del saludo pasan de 2 líneas** (70 y 87 caracteres). Además, la segunda son 2 frases de Don Pedro hablando de sí mismo (contra la regla 6).
- **I4. `diseno.md` desactualizado respecto a `textos.ts`.**
  - Guion y reacciones antiguos.
  - Plantilla con ":".
  - "El pacto no se muestra".
  - Botón "Comprar".
  - Reseñas en R.
  - Término prohibido "envío gratis" duplicado.
  - Pendientes ya resueltos en `estado.md`.

### Menores
| Archivo | Actual | Propuesta |
|---|---|---|
| textos q3 | "Tacón, sí; pero sin sufrir." | "Tacón, sí, pero sin sufrir." |
| textos q2 | "Lo más difícil en Madrid. Apuntado." | "Lo más difícil de acertar en Madrid." |
| textos q4 | "Buen ojo. Apuntado." (repite "Apuntado") | "¡Buen ojo! Ya sé lo que busca." |
| muestras / fragmentos | "Oro y plata" / "metalizado" / "dorado" | Un solo nombre: "Metalizado" |
| error trastienda | "Pase a la tienda, que allí están todos los pares." | "Mírelos usted misma: ahí están todos los pares." |
| error trastienda | "Ir a la tienda" | "Ver todos los zapatos" |
| resultados | "Ver toda la tienda" → /10-zapatos | La etiqueta promete más que el destino (lo pidió el usuario) |
| resultados | "Recomendaciones" | Suena a web (lo pidió el usuario) |
| etiqueta corta | "Sandalia · plano" | "plana" con los tipos femeninos |
| TarjetaProducto | alt = nombre también en "Más zapatos" | alt vacío donde el nombre ya es visible |
| error.tsx | la sección se anuncia como "Volver a empezar" | etiqueta propia |
| personaje · layout · pie | alt "detrás del mostrador" · sin openGraph · sin "Condiciones" | alt actualizado · openGraph con la fachada · enlace a condiciones |

Comprobado sin incidencias:
- Reacciones de 40 caracteres o menos.
- Preguntas de 19 a 40 caracteres.
- Pacto de 54 y 55 caracteres.
- Errores y 404 de 38 a 51 caracteres.
- Botones en infinitivo.
- Las nietas y "fíjese" se usan una sola vez.
- "14 días" con espacio no separable.

## Corregido desde la auditoría anterior
- Corregidos: A1–A3, M1–M4, M6, M8, M9 y B1–B21.
- Siguen abiertos:
  - B22 (openGraph).
  - M5 a medias.
  - M7, reabierto por petición del usuario.

## Patrones para la biblia
1. Regla 3 en caracteres: cada frase del cuadro, 55 como máximo (29 por línea si lleva "›"); reacciones, 40 como máximo.
2. "Seguidas" = máximo 3 por cuadro. Se reinicia con una acción de la clienta o con una pausa visible.
3. Medir las plantillas por su caso más largo con un test sobre todas las combinaciones.
4. Sin nada a la vista, nada de deícticos: se nombra el objeto.
5. La relajación se dice hablando, sin paréntesis. Si no cabe, en su propia frase.
6. Un concepto, un nombre.
7. Cada texto que nombra el calzado necesita su variante "casa".
8. `diseno.md` debe remitir a `textos.ts` en vez de copiar los textos.
9. El ejemplo de resumen de `patrones.md` incumple su propia regla de 2 líneas.

## Aplicado tras esta auditoría (2026-09-30)
Ver `docs/estado.md`. Queda para el usuario: I1 (el pacto lo pidió así), "Recomendaciones" y "Ver toda la tienda" (textos pedidos por el usuario).
