# Conceptos — Zapatería Don Pedro

Todos comparten la narrativa de `docs/narrativa.md` (fachada → entrar → Don Pedro) y el mismo punto de conversión: **fichas de producto reales de donpedrohabana.com → carrito**. **Camino corto:** unos 90 segundos hasta la recomendación. **Nivel técnico:** Next.js estático + catálogo etiquetado en JSON, sin IA y sin backend.

---

## A — "Don Pedro le atiende" (idea del usuario)
**Narrativa:** llega a la puerta de la tienda de 1958, entra y Don Pedro le hace unas preguntas de zapatero para sacarle lo suyo.
**Qué hace la usuaria:** abre la puerta y responde 4 preguntas con tarjetas ilustradas grandes (ocasión → tiempo → cuánto camina / altura de tacón → estilo). Ve 3–4 pares recomendados y debajo el resto.
**Bucle:** pregunta → respuesta visual → Don Pedro reacciona con una frase ("Una boda, ¡qué alegría!") → siguiente.
**Persuasión:** ruptura de patrón (puerta) · micro-compromisos (4 síes) · "es para su caso" (el porqué de cada par cita sus respuestas) · autoridad diegética (1958, taller) · paradoja de la elección resuelta (3–4 y no 200).
**Conversión:** botón "Ver este par" → ficha real.

## B — "Lo que lleva en el bolso" (mecánica original)
**Narrativa:** Don Pedro le pide que deje el bolso sobre el mostrador: "Enséñeme qué lleva hoy y le digo qué zapato necesita".
**Qué hace la usuaria:** en vez de responder un test, saca objetos del bolso y los pone sobre el mostrador: una invitación de boda, un paraguas, las gafas de sol, el bono del autobús, la lista de la compra, una entrada de teatro… Cada objeto es una respuesta encubierta (ocasión, tiempo, cuánto camina). Don Pedro "lee" el mostrador y deduce.
**Bucle:** elegir objeto → cae sobre el mostrador con un sonido → Don Pedro comenta → siguiente objeto.
**Persuasión:** todo lo de A, más efecto IKEA (ella compone la escena), curiosidad ("¿qué sacará Don Pedro de esto?") y prueba autodemostrada (lee pistas como un zapatero de verdad).
**Coste:** más ilustración (≈10–12 objetos) y más diseño de interacción que A. Riesgo: si los objetos no se entienden, hay que dar una pista de texto bajo cada uno.

## C — "Las cajas de la trastienda" (capa para el final, combinable con A o B)
**Narrativa:** tras las preguntas, Don Pedro desaparece en la trastienda y vuelve con varias cajas de zapatos apiladas, cada una con una nota escrita a mano.
**Qué hace la usuaria:** abre las cajas una a una (tapa → papel de seda → foto real del par) y lee la nota de Don Pedro que explica por qué ese par es para ella.
**Persuasión:** pico-final (el momento más intenso coincide con la recomendación) · efecto dotación ("sus cajas") · Zeigarnik (quedan cajas por abrir) · recompensa variable **sin azar** (el contenido está decidido por sus respuestas).
**Coste:** una ilustración de caja reutilizable más la animación de apertura. Las fotos de producto son las reales.

---

## Recomendación
**A + C.** Es la idea del usuario tal cual, con un final más memorable: la recomendación deja de ser una lista y pasa a ser un ritual de tienda (abrir la caja). Es el cierre natural de la historia y el pico emocional justo antes del clic de compra. B es más original, pero añade coste y riesgo de comprensión para un público sénior. Queda como opción si se quiere más espectáculo.

## Mapeo de preguntas → catálogo (borrador, se cierra en la fase 4)
1. **Ocasión:** diario/paseo · trabajo y recados · evento (boda, comunión) · viaje · casa → vestir, salones, sandalias de fiesta, mocasines, sport, zapatillas de casa…
2. **Tiempo:** frío · entretiempo · calor → botas/botines · mocasines/salones/bailarinas/merceditas · sandalias/alpargatas
3. **Comodidad:** "¿cuánto va a andar?" / tacón plano · medio · alto → filtro por altura de tacón (*exige etiquetar el catálogo a mano: PrestaShop no expone este dato de forma fiable*)
4. **Estilo:** clásico de siempre · con un punto moderno → marca propia y clásicos frente a marcas de tendencia
Extra opcional: "¿Le enseño también un bolso a juego?" → venta cruzada con bolsos y complementos.

## ✅ Elegido: A, con ajustes del usuario (2026-09-29)
- Solo concepto A. **Sin** cajas de la trastienda (C) ni bolso (B).
- Don Pedro hace las preguntas y, al terminar, aparece en pantalla la **sección de recomendaciones**: **6 productos en 2 columnas en móvil**, que ocupan toda la pantalla, con **foto original, precio y botón "Comprar"**. Es más fácil de entender para un público sénior y va más directo a la venta.
- Debajo, el resto de productos y "ver más" hacia la tienda.
- Trato: **usted**.
- Nietas: **Magüi y Kiska** ("Kiska" es la grafía de la entrevista escrita por ellas en masqueunlocal.org; "Kika" solo aparece en un resumen de terceros).
- Caricatura: sin foto pública del abuelo. Se diseña un zapatero de 1958 genérico y fácilmente sustituible. Las nietas lo verán con la web terminada; si no les gusta, se cambian las imágenes y el nombre.
