# Estado del proyecto — Don Pedro Habana

**Cliente:** Zapatería Don Pedro (donpedrohabana.com), Paseo de la Habana 50, Madrid
**Fase actual:** 7 — Verificación · cambios del usuario del 2026-09-30 aplicados; faltan las auditorías de móvil y voz y la entrega
- 6.1 Cimientos ✅ (tsc limpio, 14 tests en verde, build OK; Next 15.5 porque el Node local es 18)
- 6.2 ✅ M2 catálogo (611 productos, 190 modelos) · M3 fachada y entrada · M4 Don Pedro y quiz · M5 recomendaciones
- 6.3 Integración ✅ con placeholders de arte: catálogo real conectado, 164 tests en verde, build estático OK (151 kB de primera carga)
- Pendiente de cimientos: sonido de campanilla (CC0) y copiar el logo a public/
**Fase 4 aprobada:** 2026-09-29 ("continúa")
**Inicio:** 2026-09-29

## Publicación (2026-09-30)
- Enlace para probar: **https://donpedro-seven.vercel.app** (Vercel, proyecto `donpedro` de la cuenta marcos-8439, build estático ya compilado).
- Código: https://github.com/marcosfoca/donpedro (público; sin `.env.local` ni `arte/referencias/`).
- Volver a publicar: `npm run build` (con los servidores locales parados) y, desde una copia de `out/` en una carpeta llamada `donpedro`, `vercel deploy . --prod --yes`. Pendiente: conectar el repositorio en Vercel para que publique solo con cada push.
- Tema 1 decidido con el consejo (`docs/decisiones/2026-09-30-relajacion-color.md`, B frente a C, sin unanimidad): con "Uno en concreto" se relaja categorías (sin salirse de la temporada) → tacón parecido → color → temporada (opción C). Tema 2: pacto breve tras el resumen, texto del agente de persuasión.

## Hecho
- Fase 1: `docs/investigacion.md`, `docs/descubrimiento.md`
- Fase 2: `docs/narrativa.md`
- Fase 3: `docs/conceptos.md` → elegido **A** con ajustes
- Fase 4: `docs/diseno.md` (borrador)
- Referencias visuales descargadas en `arte/referencias/` (fachada ×2, interior, logo). Solo como referencia, no se publican.

## Decisiones tomadas
- Datos de las condiciones de la web incorporados: devoluciones en 14 días probándose en casa, pagos con tarjeta, Bizum o transferencia, y URLs legales (`docs/descubrimiento.md`).
- Es la zapatería de Madrid (no un negocio cubano). Objetivo: **ventas online**.
- Concepto A: fachada → entrar → Don Pedro → 4 preguntas visuales sin IA → **6 productos en 2 columnas** (foto original, precio y "Comprar") → más zapatos y "Ver toda la tienda".
- Don Pedro trata **de usted**. Nietas: **Magüi y Kiska** (grafía de la entrevista escrita por ellas).
- Colores y tipografías de la web. Sin descuentos. Permiso para usar las reseñas y los nombres.
- Sin foto pública del abuelo: caricatura genérica de zapatero de 1958, sustituible (`content/personaje.ts`). Las nietas la verán con la web terminada.
- Nivel técnico B: Next.js estático + catálogo sincronizado desde los listados JSON de PrestaShop.

## Congelado (esperando datos)
- Origen del tráfico → tracking, píxeles y UTMs
- Coste y zona de envío (contradicción en las condiciones: 12 € España y Portugal frente a solo Madrid)
- Plazo de entrega
- Dominio final

## Pendientes
- Elegir la dirección de estilo (`arte/estilo/log.md`) y configurar `GEMINI_API_KEY`
- Confirmar con el cliente el coste y la zona de envío
- Recomendar al cliente: compra como invitada en PrestaShop y "Elija su talla" en lugar de la 35 preseleccionada
- Fase 5: biblia visual (estilo de ilustración + Don Pedro) con Gemini

## Notas para la integración
- M3 ✅: añadir `textos.entrada.etiqueta` ("Entrando en la tienda") y usarlo en Entrada.tsx. La posición de la puerta se ajusta en `components/fachada/geometria.ts` (fracciones de la imagen).
- Arte: A2 = **solo la hoja de la puerta**, recortada a su rectángulo (no una capa completa).
- M4 ✅: en integración, añadir la prop `compacta` a TarjetaOpcion, el tamaño "mediano" a DonPedro y el reenvío de `ref` en Boton, y quitar los `!important` del quiz. Acortar las reacciones de Q1 celebracion y Q4 todos (4 líneas a 375px). Sustituir recomendarMock en Trastienda y Recomendaciones.
- M5 ✅: **problema de maquetación**: a 375×667 caben las 6 tarjetas, pero la foto se queda en ~45px. En integración: ocultar BotonSonido en resultados, compactar la cabecera R1 (resumen en 2 líneas), poner precio y "Comprar" en la misma fila, nombre en 1 línea en pantallas bajas, token de mínimo móvil ~150px. Objetivo: foto ≥ 80px a 375×667. Añadir `resultados.etiqueta` y un texto corto para foto rota. El marco A13 con el centro liso.
- Integración parcial (2026-09-29): recorrido completo probado a 375×667 con el mock y sin errores de consola. El sonido se oculta en resultados. Tarjeta R2 en móvil = foto + precio + "Comprar" a todo el ancho (el nombre solo desde 768px; en móvil precio y botón en la misma fila no cabían). Foto ≈ 80px a 375×667. Reacciones acortadas. "1 de 4" en una sola línea. Pendiente: sustituir el mock por M2 y hacer los refactors de los componentes base (compacta, mediano, ref).
- Integración (2026-09-29): el color que no coincide ahora **excluye** (−5), igual que el tacón; antes aparecían zapatos de otro color sin aviso en 36 casos. Test de honestidad añadido. El color de un nombre = **primer** color concreto (BICOLOR solo como último recurso). Imágenes home_default_2x (640px). Fotos ampliadas ×1,3 en la tarjeta. Mock eliminado. Tildes añadidas en tipoOracion.
- Deuda menor: props `compacta` (TarjetaOpcion), `mediano` (DonPedro) y reenvío de `ref` (Boton) para quitar los `!important` del quiz.
- Nota: `npm run build` falla con EPERM si `next dev` está corriendo (bloquea .next): pararlo antes.

## Arte (fase 5)
- Estilo 2 "cartel de época" ✅ → `arte/biblia.md`. Clave de Gemini en `.env.local` (fuera de git). No se revoca (decisión del usuario, 2026-09-30).
- Modelo gemini-3-pro-image vía `scripts/arte/generar.py` (con `--aspecto`). Croma con `scripts/arte/limpiar_croma.py`.
- ✅ Fachada día y noche (según la hora, `lib/momento.ts`), móvil y escritorio, alineadas al píxel. ✅ Hoja de la puerta (bisagra derecha). En móvil, la ilustración se pinta un 8 % más alta para ganar cielo (`alturaExtra`).
- ✅ Don Pedro: hoja de personaje (chaleco marrón) + 6 poses (incluida "apurado" para los errores).
- ✅ Interior 1 (móvil) + outpaint de escritorio. ✅ 16 iconos (magenta, 2K). ✅ Marco de reseñas con CSS. ✅ Campanilla sintetizada (`scripts/arte/campanilla.py`). **Sin placeholders.** `public/arte` ocupa 1,2 MB.
- Portada: título, promesa y CTA en el cielo; la fachada se pinta un 8 % más alta en móvil.
- Build OK, 164 tests en verde (2026-09-29).

## Fase 7 — Auditorías (2026-09-29)
Informes en `docs/auditorias/` (persuasion.md, voz.md, qa-movil.md). QA: apto para preview, sin críticos.
Plan de correcciones pendiente de validar con el usuario. Prioridad 1:
- Sandalias "con frío": la estación debe excluir, verificado en 22 casos.
- Reacciones ilegibles (más cortas y 2,4 s).
- 404 y error en inglés.
- Contraste del título de día.
- Foto de 54 px en R2 con relajación.
- Fachada de noche que parpadea.
- Catálogo en el chunk inicial.
- Deduplicado roto por erratas y tildes del catálogo.
- Volver desde la ficha.
- Textos: pacto, relajación, error, "Ver toda la tienda".

Decisiones del usuario o del cliente:
- Nombre corto en la tarjeta móvil.
- Mencionar el coste de devolución.

## Correcciones tras auditorías + ajustes del usuario (2026-09-29/30) — EN CURSO
Hecho (tsc limpio, 168 tests en verde, build OK):
- Temporada que excluye (sin sandalias con frío) y relajación "otra temporada" anunciada; tildes, nombres propios y erratas del catálogo; deduplicado de palabras repetidas.
- Textos de la auditoría de voz: reacciones cortas (2,4 s, tocar adelanta), 404 y error en español, "Ver todos los …", pacto en 2 burbujas (la talla primero), empatía y taller en el saludo, "armario" en la trastienda, despedida.
- Fachada por CSS según `data-momento` (script en <head>): solo se descarga la de día o la de noche. Título en tinta de día (contraste ≥ 8,8:1). Retoma sin destello (`data-reanudar`) y restauración de scroll y tandas.
- Recomendador en carga diferida (First Load 152 → 120 kB). Favicon, `lang="es-ES"`, foco doble, hover solo en dispositivos con puntero, `.vercelignore`, `serve` en devDeps.
- Usuario: sin botón "Comprar" (la tarjeta es el botón); Don Pedro dice el resumen en la trastienda y "Ver los zapatos" abre la cuadrícula a pantalla completa (fotos ~157 px) sobre el interior; sin velos; etiqueta corta en las tarjetas.
- Usuario: Don Pedro de CUERPO ENTERO (6 poses nuevas) detrás del diálogo (`DonPedroTras`). En el saludo, un solo `CuadroDialogo` que pasa frase a frase.
Hecho después (2026-09-30), sustituye a los pendientes de encuadre de esta lista.

## Momentos de diálogo, quiz "wow" y colores concretos (2026-09-30) ✅
Petición del usuario, aplicada y probada a 375×667 (dev y build estático). tsc limpio, 507 tests en verde, build OK (121 kB).
- **Cada cuadro de diálogo tiene su momento.** Don Pedro está de pie en el suelo de la tienda, delante del mostrador (`DonPedroEnTienda`: 54dvh, pies a 84 px, sombra en el suelo) y habla en un único cuadro arriba con pico hacia él (`CuadroDialogo`, frase a frase). Contenedor común `EscenaTienda` (saludo, preguntas, trastienda, errores, 404). Fuera `DonPedroTras`, `DonPedroDice`, `Burbujas` y la miniatura.
- **Quiz por momentos:** Don Pedro pregunta → se retira (300 ms) y salen las opciones con rebote en cascada, icono que salta y brillo dorado → al elegir, la tarjeta rebota con anillo, sello ✓ y chispas (y vibración corta en Android); las demás se apartan → Don Pedro vuelve contento y reacciona → siguiente. Tocar adelanta. Si la pregunta ya tenía respuesta (Atrás), empieza en las opciones. Con reduced-motion, solo fundidos.
- **Q4 nueva:** Discretos / Llamativos / Cualquiera / Uno en concreto → 12 muestras de piel (varias a la vez + "Seguir"). "Uno en específico" del usuario se escribe "Uno en concreto" (español de España, regla de voz 4). Catálogo reetiquetado por tono concreto (`lib/etiquetado.ts → TONOS`, `TONOS_DISCRETOS`; burdeos cuenta como discreto; nuevo `--reetiquetar` en `scripts/sync-catalogo.mjs`). Muestras e iconos generados con `scripts/arte/muestras.py` a partir del grano de las muestras aprobadas.
- **Resultados:** fondo opacado otra vez (velo crema al 70 %: el usuario se equivocó al pedir quitarlo); solo título "Recomendaciones", las 6, "Más zapatos para usted" (todos a la vista) y un único botón "Ver toda la tienda" → /10-zapatos. Fuera reseñas, pacto, despedida, "Ver más zapatos" y "Volver a empezar" (los textos se conservan en `content/resenas.ts` y `config.pacto`).
- Consejo (`docs/decisiones/2026-09-30-momentos-quiz.md`): 2 de 3 modelos (el tercero no respondió) coinciden: el guía se retira durante las opciones y vuelve para reaccionar; colores con selección múltiple.
- Botón tras hablar con Don Pedro ("Empezamos", "Ver los zapatos", "Ir a la tienda"…): se probó en el centro, delante de él y bajo su cara, y el usuario prefirió dejarlo abajo; se queda abajo con animación que llama la atención (`.accion-destacada`: entrada con rebote, borde crema, sombra y halo dorado que late 3 veces).
- Dato: con un color raro suelto (gris, rojo, verde, rosa, blanco, metalizado) el recomendador casi siempre completa con otros colores y Don Pedro lo avisa ("y alguno de otro color"); con "Discretos", solo en 5 de 27 combinaciones.

Pendiente:
- Decidir si, con "Uno en concreto", se relaja antes el tacón o la temporada que el color (hoy el color es lo primero que se relaja, igual que en el resto).
- Decidir si el pacto (talla y 14 días de devolución) lo dice Don Pedro en la trastienda antes de "Ver los zapatos": ya no aparece en ningún sitio y es la reversión de riesgo.
- Relanzar las auditorías afectadas (qa-movil y voz) y cerrar la fase 7 con la entrega (resumen, variables, cómo editar contenido).
- Confirmar con el cliente la zona y el coste de envío (hoy no se muestra en ningún sitio).
