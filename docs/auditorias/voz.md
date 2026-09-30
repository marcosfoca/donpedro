# Auditoría de voz — "Don Pedro le atiende"

2026-09-29 · auditor-voz (solo lectura) · biblia: diseno.md §1, narrativa.md.

## Veredicto
**Lo que aguanta:**
- Usted en el 100 % de los textos de Don Pedro.
- 0 términos del vocabulario prohibido en texto visible, ni en los 611 nombres del catálogo.
- Sin urgencia ni piropos al cuerpo; no se promete gratuidad.
- "Magüi y Kiska" aparecen una sola vez; signos ¡ y ¿ correctos.

**Lo que falla:**
- El 404 y la página de error salen **en inglés**.
- Burbujas de más de 2 líneas; las reacciones son ilegibles en 1,2 s.
- Nombres de catálogo con tildes perdidas, nombres propios en minúscula y erratas.

Recuento: 3 altas · 9 medias · 22 bajas.

## Altas
- **A1. Reacciones ilegibles.** `reaccionMs: 1200` (`lib/tokens.ts:26`) con reacciones de 45–73 caracteres. Propuesta: reacciones de 40 caracteres o menos y 2,2–2,5 s.
- **A2. Reacciones más cortas** (`content/textos.ts`), propuestas:
  - diario: "Los de todos los días no pueden fallar."
  - celebracion: "¡Qué alegría! Ahí se está mucho de pie."
  - caminar: "Primero el pie; lo bonito viene luego."
  - casa: "A gusto en casa. Solo me falta una cosa."
  - entretiempo: "Lo más difícil en Madrid. Apuntado."
  - calor: "Pie fresquito, que agosto no perdona."
  - plano: "Plano no quiere decir sin gracia." (quitar "Muy bien hecho", que suena condescendiente)
  - bajo: "Lo que más me piden: altura sin sufrir."
  - tacon: "Tacón, sí; pero sin sufrir."
  - color: "¡Eso me gusta! El color alegra la calle."
  - todos: "Elijo yo. No la voy a defraudar."
- **A3. Falta `app/not-found.tsx` y `app/error.tsx`.** Hoy salen el 404 y el error de Next en inglés. Propuesta:
  - 404: "Vaya, esta puerta no lleva a ningún sitio." / "Vuelva a la entrada, que le atiendo yo." + botón "Volver a la entrada".
  - Error: "Vaya, se me ha caído una caja del mostrador." / "Empecemos otra vez, que no tardo nada." + botón "Volver a empezar".

## Medias
- **M1. Pacto de 131 caracteres.** Pasarlo a 2 burbujas: "Pídaselos tranquila: se los prueba en casa, como aquí." / "Y si no le convencen, tiene 14 días para devolvérmelos."
- **M2. Relajación larga y sin concordancia en `casa`.** Propuesta: "No tenía más {f}; le he puesto alguno parecido." y, en `casa`, "alguna parecida".
- **M3. "de ese tipo" no dice nada.** Sustituir por "para el frío / para el entretiempo / para el calor".
- **M4. Tres "con" seguidos en R1.** Usar "de poco tacón", "de tacón", "de color".
- **M5. El error de trastienda promete "se lo busco allí".** Propuesta: "Vaya, se me ha atascado la puerta de la trastienda." / "Pase a la tienda, que allí están todos los pares."
- **M6. "Foto no disponible" no lo dice Don Pedro.** Propuesta: "Se me ha escondido la foto" + nombre en sr-only cuando no hay foto.
- **M7. "Ver toda la tienda" lleva a una categoría.** Propuesta: "Ver todos los botines", etc.
- **M8. Tildes y nombres propios en `tipoOracion`.** Añadir inspiración, talón, petróleo, París, y Elena, Bonny, Passy, Leyna, Malori, Triana, H.
- **M9. Erratas del catálogo** (charol, elásticos, plata, beige, "alto alto", "tiras tiras"). Corregirlas en PrestaShop; mientras tanto, un mapa `CORRECCIONES`.

## Bajas (resumen)
- **B1–B5. Textos más cortos:**
  - S2: "Soy Pedro: abrí esta casa…"
  - S3: "Dígame cuatro cosas y le saco lo que yo le pondría."
  - "Empezamos" frente a la regla del infinitivo: anotar la excepción.
  - Q3: "Dígame la verdad: ¿qué tal con el tacón?"
  - oscuros: "Combinan con todo. Buena elección."
- **B6.** `aria-label` en los "Saltar": "Saltar el saludo" y "Saltar la espera".
- **B7.** Usar `textos.entrada.etiqueta` en Entrada.
- **B8–B12. Literales fuera de `content/`:** etiquetas de sección, "{nombre} dice:" y aria-label del pie.
- **B13.** BotonSonido: quitar el aria-label que cambia y dejar "Sonido" con aria-pressed.
- **B14–B15.** aria-label de la cuadrícula y del pacto.
- **B16.** "Más zapatos" vacío sin voz.
- **B17.** La red de seguridad del recomendador no anuncia la relajación.
- **B18.** Texto `errores.imagen` sin usar.
- **B19.** "Paseo de la Habana, 50" siempre con coma.
- **B20.** `lang="es-ES"`.
- **B21.** Saludos por hora a `content/` y corte a las 14 h ("buenos días" hasta comer en Madrid).
- **B22.** openGraph para compartir por WhatsApp.

## Patrones para la biblia
- Medir la regla 3 en caracteres: 40 en la burbuja lateral, 58 a ancho completo.
- Escribir las excepciones de voz de la clienta ("Empezamos", opciones en primera persona).
- Revisar el género en las plantillas.
- Guionizar los rincones: 404, error, foto rota, lista vacía.
- Los nombres del catálogo también son voz.
- Todo texto vive en `content/`.
- Ninguna etiqueta promete más que su destino.
- Decidir sobre "el taller" (es de reparación).
- Limitar los diminutivos y los elogios.
- Erratas en los docs: "66 años" (usar "desde 1958"), "Garantía [CONGELADO]" en narrativa.
