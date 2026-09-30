# Documento de diseño — "Don Pedro le atiende"

> Contrato para todos los sub-agentes. Autosuficiente: no hace falta leer nada más para construir, salvo lo que se indique.
> Cliente: Zapatería Don Pedro, Paseo de la Habana 50, 28036 Madrid. Casa fundada en 1958. Tienda online PrestaShop: https://donpedrohabana.com
> Estado: **BORRADOR — pendiente de aprobación del usuario.** Fecha: 2026-09-29.

---

## 0. Resumen
Landing de **asesor de calzado** para **vender online**. La clienta llega a la fachada ilustrada de la tienda real, abre la puerta y la recibe **Don Pedro**, caricatura tierna del fundador. Don Pedro le hace **4 preguntas visuales, sin IA**, y le muestra **6 zapatos reales del catálogo** en una cuadrícula de 2 columnas, cada uno con **foto original, precio y botón "Comprar"** que lleva a la ficha real en donpedrohabana.com. Debajo aparecen más productos de su selección y un acceso a la tienda completa.

- **Camino:** corto, unos 60–90 s hasta las recomendaciones.
- **Nivel técnico:** B. Next.js estático + catálogo real sincronizado desde PrestaShop a JSON. Sin backend, sin IA, sin datos personales.
- **Público:** mujer de más de 50, Madrid, nivel medio-alto. Diseño **sénior-first**: letra grande, botones grandes, una decisión por pantalla.

### Congelado (no construir hasta tener datos)
| Congelado | Qué implica |
|---|---|
| Origen del tráfico | Sin píxel de Meta, Google Ads ni UTMs por canal. Solo se deja preparado un adaptador `track()` que no envía nada (ver §5.5) |
| Coste y zona de envío | Las condiciones de la web se contradicen ("12 € España y Portugal" frente a "solo en Madrid"). **No se menciona el envío** hasta que el cliente lo confirme (`config.envio: null`). *Descongelado:* devoluciones en 14 días, probarse en casa y métodos de pago, que sí son consistentes (ver §4.4) |
| Plazo | Sin fecha. Se construye por fases con checkpoint |
| Descuentos | **Ninguno.** No se inventan códigos, regalos ni rebajas. Los precios tachados solo aparecen si PrestaShop los da (outlet real) |
| Dominio y hosting final | Deploy de preview en Vercel. El dominio (p. ej. `asesor.donpedrohabana.com`) se decide después |

---

## 1. Biblia narrativa

### Premisa
"La zapatería de siempre, con su fundador detrás del mostrador." La metáfora es **que la atiendan como en la tienda, aunque compre desde casa**. Homenaje: no se menciona que Don Pedro haya fallecido ni se juega con ello, y nunca se ridiculiza al personaje.

### Personajes
- **Protagonista:** la clienta. Todo lo que ve después del quiz se construye con sus respuestas.
- **Guía: Don Pedro.** Caballero zapatero madrileño de 1958: chaleco o bata de trabajo, gafas en la punta de la nariz, calzador o cinta de medir. Galante, cálido, con humor suave. Aporta **empatía** ("un zapato bonito que hace daño se queda en el armario") y **autoridad** ("llevo desde 1958 mirando pies en este barrio", taller propio, las nietas siguen la casa).
- **Nietas:** **Magüi y Kiska.** Se nombran solo una vez, con cariño.

### Voz (reglas verificables)
1. Don Pedro trata **de usted**, siempre. Nunca tutea.
2. Botones y etiquetas de interfaz en infinitivo o neutro ("Abrir la puerta", "Comprar", "Ver más zapatos").
3. Burbujas de 1–2 líneas y un máximo de 3 seguidas sin que la clienta actúe.
4. Español de España. Madrileño castizo **muy ligero**: se permite "fíjese", "hija" (máx. 1 vez en toda la experiencia) y "¡ea!".
5. Piropos a los zapatos, **nunca al cuerpo** de la clienta.
6. Don Pedro nunca habla de sí mismo más de una frase seguida.
7. **Vocabulario permitido:** pie, horma, piel, suela, tacón, cuña, plano, par, zapato, la casa, el taller, la trastienda, ocasión, cómoda, arreglada, de vestir, de diario.
8. **Vocabulario prohibido:** producto, artículo, SKU, catálogo, oferta, descuento, promoción, stock, últimas unidades, envío gratis, devolución gratis, look, outfit, must-have, tendencia *top*, "IA", "algoritmo", "personalizado por nuestro sistema".
9. Los errores y los estados vacíos también los dice Don Pedro (ver §2, pantalla E).
10. Nada de urgencia ni escasez.

### Integración diegética
- **Autoridad:** 1958, el taller y las nietas, en el saludo de Don Pedro.
- **Prueba social:** reseñas reales de Google, presentadas como "lo que me dicen las clientas", en un marco colgado en la pared (pantalla R). Solo las 3 citas autorizadas (§4.3), literales.
- **Precio:** siempre visible en cada tarjeta, sin esconderlo. Tachado solo si PrestaShop trae precio anterior real.
- **Devoluciones como pacto de Don Pedro** (dato real de las condiciones): puede probárselos en casa como en la tienda y tiene 14 días para devolverlos. **Nunca** se dice que la devolución sea gratis (la paga la clienta salvo defecto). El envío sigue sin mencionarse (pendiente).

---

## 2. Guion pantalla a pantalla

Convenciones: **[DP]** = burbuja de Don Pedro. `{saludo}` = "Buenos días" (6–13 h), "Buenas tardes" (13–21 h) o "Buenas noches" (21–6 h), según la hora local del dispositivo.

> **Cambio 2026-09-30 (petición del usuario): cada cosa tiene su momento.** Don Pedro está **de pie en el suelo de la tienda**, delante del mostrador (54 % del alto, los pies a 84 px del borde), y habla en **un solo cuadro de diálogo arriba**, con el pico hacia él, que pasa **frase a frase** (≈65 ms por carácter, mínimo 2,4 s; tocar adelanta). Lo demás sale **después** de que hable: en las preguntas, Don Pedro pregunta → se retira y salen las opciones (la pregunta se queda arriba) → al elegir, efecto de elección → vuelve y reacciona. Componentes: `EscenaTienda`, `DonPedroEnTienda`, `CuadroDialogo`. Donde este guion diga "burbujas" o "miniatura", manda este cambio. **Los textos literales vigentes están en `content/textos.ts` y `content/config.ts`, y mandan sobre los que se citan en este guion.** Cada frase del cuadro mide 55 caracteres o menos (2 líneas a 375 px), y un test lo comprueba en el resumen.

### F — La fachada (hero)
- **Ve:** ilustración a pantalla completa (100dvh) de la fachada real: rótulo "Don Pedro" en cursiva marrón, "CASA FUNDADA EN 1958", toldo marrón "Zapatos · Bolsos · Complementos", escaparate lleno de zapatos, puerta de cristal con marco marrón y felpudo. Luz de tarde dorada.
- **En el cielo**, sobre la fachada, en Vollkorn grande color crema con sombra suave:
  - Título: **"Don Pedro le atiende"**
  - Subtítulo: **"Cuatro preguntas y le saco los zapatos que yo le pondría."**
- **CTA** (botón grande, ancho casi completo, sobre la puerta y por encima del pliegue): **"Abrir la puerta"**. Debajo, en pequeño: "Paseo de la Habana, 50 · Madrid · Desde 1958".
- **Hace:** pulsa el botón (o toca la puerta, que también es interactiva).
- **Siente:** curiosidad y calidez, "esto no es una web normal".
- **Persuasión:** ruptura de patrón · promesa clara (AIDA: Atención) · autoridad (1958) · primer micro-compromiso. **Abre el bucle 1:** "¿qué zapatos me sacará?".
- Accesibilidad: el botón es el elemento principal. La puerta es un segundo destino táctil, no el único.

### T — Entrar (transición, 1,2 s, se puede saltar tocando)
- La puerta se abre hacia dentro y la cámara avanza (escala y fundido) hasta el interior. Suena la **campanilla** si el sonido está activado.
- **Sonido:** apagado por defecto. Hay un botón de altavoz siempre visible (esquina superior derecha, 48px) con el texto "Sonido". El primer toque en "Abrir la puerta" cuenta como gesto, pero **no** activa el sonido si la clienta no lo ha pedido.
- `prefers-reduced-motion`: fundido simple de 300 ms, sin zoom.
- **Persuasión:** inmersión sensorial · "ya estoy dentro" (compromiso).

### S — El saludo
- **Ve:** interior de la tienda ilustrado (estanterías de madera con zapatos, bolsos colgados, mostrador, suelo de baldosa clara). Don Pedro en pose **saludo** tras el mostrador, en la mitad superior de la pantalla. Las burbujas aparecen de una en una (400 ms de separación). Botón "Saltar" para quien repite.
- **[DP]** "¡{saludo}! Pase, pase, no se quede en la puerta."
- **[DP]** "Soy Pedro. Abrí esta casa en 1958 y hoy la llevan mis nietas, Magüi y Kiska."
- **[DP]** "Dígame cuatro cosas y le saco de la trastienda lo que yo le pondría."
- **CTA:** **"Empezamos"**
- **Siente:** acogida y confianza.
- **Persuasión:** intimidad parasocial · autoridad diegética (1958 y la casa) · simpatía · StoryBrand (el guía se presenta con empatía, autoridad y plan). Refuerza el bucle 1.

### Q1 — La ocasión
- Arriba, Don Pedro en pose **escuchando**. Barra de progreso "1 de 4" con 4 puntos (zapatitos).
- **[DP]** "Lo primero: ¿para qué los quiere?"
- **Opciones** (tarjetas ilustradas grandes, 2×2 en móvil):
  | id | Texto | Ilustración |
  |---|---|---|
  | `diario` | "Para el día a día" | bolso de mano y llaves |
  | `celebracion` | "Para una boda o una celebración" | invitación con lazo |
  | `caminar` | "Para caminar mucho" | plano de Madrid o bastón de paseo |
  | `casa` | "Para estar en casa" | taza de café y zapatillas |
- **Reacción [DP]** (1,2 s tras elegir, luego avanza):
  - diario → "Los de todos los días son los más importantes. Esos no pueden fallar."
  - celebracion → "¡Una celebración! Qué alegría. Ahí se está muchas horas de pie, lo tendré en cuenta."
  - caminar → "Para andar, lo primero es el pie. Lo bonito viene después… pero viene."
  - casa → "En casa se tiene que estar a gusto. Eso lo arreglo yo en un momento."
- **Persuasión:** micro-compromiso 1 · "es para su caso" · dolor externo reconocido ("muchas horas de pie", "no pueden fallar").
- **Regla:** si elige `casa`, se **saltan Q2 y Q3** (la barra pasa a "de 2"). Q4 sigue.

### Q2 — El tiempo
- **[DP]** "¿Y para qué tiempo?"
- **Opciones** (3 tarjetas en columna o fila):
  | id | Texto | Ilustración |
  |---|---|---|
  | `frio` | "Para el frío" | bufanda y paraguas |
  | `entretiempo` | "Para el entretiempo" | hojas de otoño y gabardina |
  | `calor` | "Para el calor" | abanico y sol |
- **Reacción [DP]:**
  - frio → "Pie calentito y bien sujeto. Apuntado."
  - entretiempo → "Entretiempo, lo más difícil de acertar en Madrid. Apuntado."
  - calor → "Pie fresquito, que el verano aquí no perdona. Apuntado."
- **Persuasión:** micro-compromiso 2 · simpatía (humor de Madrid).

### Q3 — El tacón (la comodidad)
- **[DP]** "Ahora dígame la verdad: ¿cómo se lleva con el tacón?"
- **Opciones** (ilustraciones de perfil de zapato con la altura marcada):
  | id | Texto | Subtexto |
  |---|---|---|
  | `plano` | "Plano, por favor" | "Sin tacón" |
  | `bajo` | "Un poquito" | "Cuña o tacón bajo" |
  | `tacon` | "Con tacón" | "Me gusta ir más alta" |
- **Reacción [DP]:**
  - plano → "Muy bien hecho. Plano no quiere decir sin gracia, ya verá."
  - bajo → "Lo que más me piden: un poco de altura sin sufrir."
  - tacon → "Tacón, pero de los que se aguantan. Aquí no vendemos tacones para sufrir."
- **Persuasión:** **dolor interno** (el miedo a que duela) reconocido y desactivado · objeción "¿será cómodo?" · autoridad.

### Q4 — El color (cambio 2026-09-30: por carácter y, si quiere, colores concretos)
- **[DP]** "Y por último: ¿qué colores le gustan?"
- **Opciones** (muestras de piel redondas con textura, más texto):
  | id | Texto | Subtexto | Filtra |
  |---|---|---|---|
  | `discretos` | "Discretos" | "Negro, marrón, beige…" | negro, marrón, beige, blanco, gris, azul marino, burdeos |
  | `llamativos` | "Llamativos" | "Rojo, verde, dorado…" | azul, rojo, rosa, verde, metalizados y el resto (amarillo, estampados…) |
  | `todos` | "Cualquiera" | "Usted manda" | nada |
  | `concreto` | "Uno en concreto" | "Se lo digo yo" | abre las muestras |
- **"Uno en concreto"** → [DP] "¿Cuál? Si quiere, marque varios." → 12 muestras (3 × 4): negro, marrón, beige, blanco, gris, azul marino, burdeos, azul, rojo, rosa, verde, oro y plata. Se puede marcar una o varias y se confirma con **"Seguir"** (desactivado hasta marcar una). Consejo del 2026-09-30: selección múltiple.
- **Reacción [DP]:** discretos → "Discretos: combinan con todo." · llamativos → "¡Eso me gusta! El color alegra la calle." · todos → "Elijo yo. No la voy a defraudar." · concreto → "Buen ojo. Apuntado."
- **Persuasión:** micro-compromiso 4 · efecto dotación ("sus colores") · gradiente de meta (última pregunta) · personalización real (el filtro excluye y se anuncia la relajación).

### E — "Deme un momentito…" (transición, 1,5 s, se puede saltar)
- Don Pedro en pose **trastienda**: de espaldas o de perfil, con una caja de zapatos.
- **[DP]** "Deme un momentito, que voy a la trastienda…"
- Tres puntos animados. Mientras tanto se calculan las recomendaciones (instantáneo) y se **precargan** las 6 fotos.
- **Persuasión:** anticipación (el bucle 1 está a punto de cerrarse) · coste hundido.
- **Estado de error** (catálogo vacío o fallo al cargar): [DP] "Vaya, se me ha atascado la puerta de la trastienda. Mire, pase a la tienda y se lo busco allí." con el botón "Ir a la tienda" → https://donpedrohabana.com/10-zapatos

### R — Las recomendaciones (**conversión**)
Pantalla principal de venta. **Cierra el bucle 1.** Rehecha el 2026-09-30 a petición del usuario.

**Antes, en la trastienda:** Don Pedro (pose **señalando**, de pie en la tienda) **dice** el resumen de sus respuestas reales y el botón "Ver los zapatos" abre la selección.
- Resumen en 2 frases de 55 caracteres o menos: **"Para {ocasión}, {tiempo}, {tacón}…"** / **"…y {color}: le he sacado seis."** (casa: "Unas zapatillas para estar en casa…" / "…{color}: le he sacado seis."). Después, el pacto (`config.pacto`), en 2 frases, y "Ver los zapatos" (en casa, "Ver las zapatillas").
- Color: "en colores discretos" · "en colores llamativos" · "del color que sea" · concretos: "en negro", "en negro o azul marino", "en negro, gris o metalizado"; con más de 3, "en los colores que me ha dicho".
- Relajación honesta, dicha en su propia frase: "Hay alguno de otro color: no tenía más." Si no cabe: "Hay alguno distinto de lo que me ha dicho."

**La página de resultados muestra SOLO esto, en este orden** (sin reseñas, pacto, despedida ni "Volver a empezar"):
1. El interior de la tienda **opacado** detrás (velo crema al 70 %), fijo.
2. Título **"Recomendaciones"**.
3. **Las 6** en 2 columnas × 3 filas (3 × 2 en escritorio), que con el título ocupan la pantalla. La tarjeta es el botón: foto original, precio, flecha y etiqueta corta ("Salón · tacón bajo").
4. **"Más zapatos para usted"**: el resto del ranking (hasta `config.maxMasZapatos`), todos a la vista, para bajar con scroll.
5. **Un solo botón: "Ver toda la tienda"** → `config.tiendaZapatosUrl`.

El pie legal lo pone el layout. Las reseñas (`content/resenas.ts`) y los pagos (`config.pagos`) se conservan en el contenido, pero no se muestran. El pacto lo dice Don Pedro en la trastienda.

---

## 3. Mapa de persuasión

### 3.1 Troncal
**StoryBrand dentro de AIDA.** Hipótesis de tráfico templado (consciente del problema o de la solución: busca un zapato para algo concreto). La clienta (héroe) quiere ir arreglada y cómoda. Tiene un problema: comprar online sola, con miedo a equivocarse y a que duela. Encuentra un guía (Don Pedro: empatía, 1958 y el taller) que le da un plan (4 preguntas) y la llama a la acción ("Comprar"), evitando el fracaso (un zapato que se queda en el armario) y logrando el éxito (sentirse atendida y acertar). AIDA ordena el ritmo: F = Atención, S y Q = Interés, E y R1 = Deseo, R2 = Acción. *Revisar cuando se sepa el tráfico: si es frío de Meta, puede hacer falta reforzar el dolor en F.*

### 3.2 Por momento
| Pantalla | Framework local | Mecanismos | Bucle | Emoción |
|---|---|---|---|---|
| F | AIDA-A | Ruptura de patrón, autoridad (1958), promesa | Abre 1: "qué me sacará" | Curiosidad, calidez |
| T | — | Inmersión, compromiso | — | Asombro suave |
| S | SB7 (guía) | Parasocial, autoridad diegética, simpatía | Refuerza 1 | Acogida |
| Q1 | PAS-P | Micro-compromiso, dolor externo | Abre 2: progreso 1/4 (Zeigarnik) | Ser escuchada |
| Q2 | — | Micro-compromiso, simpatía | 2 | Complicidad |
| Q3 | PAS-A/S | Dolor interno desactivado, objeción de comodidad | 2 | Alivio |
| Q4 | — | Dotación, gradiente de meta | Cierra 2 | Ilusión |
| E | — | Anticipación, coste hundido | 1 a punto | Expectación |
| R1 | BAB-B (puente) | Personalización real, no Barnum | Cierra 1 | Reconocimiento |
| R2 | FAB / 4P-Push | Paradoja de la elección, pico-final | Conversión | Deseo, seguridad |
| R2b | Reversión de riesgo | Objeción de la talla, reciprocidad | — | Tranquilidad |
| R3 | 4P-Proof | Prueba social real | — | Confianza |
| R4 | — | Segunda oportunidad | — | Exploración |

### 3.3 Recorrido del dolor
- **Reconocimiento:** Q1 ("no pueden fallar", "muchas horas de pie") y Q3 ("¿cómo se lleva con el tacón?").
- **Agitación (suave, público sénior, sin dramatizar):** Q3 ("aquí no vendemos tacones para sufrir"), la idea del zapato que se queda en el armario.
- **Solución:** R1 y R2. Los zapatos aparecen como respuesta a lo que ella ha dicho.

### 3.4 Escalera de compromisos
Abrir la puerta → Empezamos → ocasión → tiempo → tacón → color → (mirar sus 6) → **Comprar** → (en PrestaShop) talla → carrito.

### 3.5 Autoridad y prueba (todo real)
Casa fundada en 1958 (rótulo real), taller de reparación, las nietas Magüi y Kiska al frente, reseñas de Google con permiso del cliente, fotos originales del catálogo.

### 3.6 Objeciones
| Objeción | Dónde se desactiva |
|---|---|
| "¿Serán cómodos?" | Q3 y su reacción; la cabecera R1 repite su preferencia de tacón |
| "No sé cuál elegir" | R2: solo 6, elegidos por sus respuestas |
| "¿Es de fiar?" | S (1958, familia), R3 (reseñas), el enlace lleva a la tienda de siempre |
| "¿Y si no me queda bien la talla?" | R2b: se los prueba en casa y tiene 14 días para devolverlos (dato de las condiciones). No se promete que la devolución sea gratis |
| "¿Cuánto cuesta?" | El precio está visible en cada tarjeta, sin esconderlo |

---

## 4. Contenido y configuración

### 4.1 Marca
- **Colores** (de la web): marrón cuero `#816040`, crema `#F1E6B2`, dorado `#CEB888`, azul marino `#2E4674`, texto `#2B2118` (más oscuro que el `#444` de la web, por contraste), grises `#666/#999`, blanco `#FFFFFF`. Fondo general crema muy claro `#FBF7EA`.
- **Tipografías** (Google Fonts, las de la web): **Vollkorn** (voz de Don Pedro, títulos), **Source Sans Pro** (interfaz, precios, botones; en Google Fonts se llama "Source Sans 3"). Fjalla One no se usa, porque es condensada y cuesta leerla con poca vista.
- **Tamaños mínimos:** texto base 18px; burbujas de Don Pedro 20px; botones 18px con alto mínimo de 56px (en tarjeta, 48px); zonas táctiles de al menos 48×48.
- **Logo:** `arte/referencias/logo.jpg` (en realidad es PNG, 400×101).

### 4.2 Textos
Todos en `content/textos.ts` (§2 literal), de modo que el cliente o la agencia los editen sin tocar componentes.

### 4.3 Reseñas autorizadas (literales, sin nombres)
1. "Excelente relación calidad precio. Dependientas muy profesionales y amables"
2. "Llevo más de 40 años comprando en esta tienda"
3. "Lo mejor en zapatos clásicos y bolsos, muy buena confección"
Fuente: reseñas de Google recogidas en lamanzanadeeva.es/madrid/don-pedro/. Permiso de uso confirmado por el usuario el 2026-09-29.

### 4.4 Configuración (`content/config.ts`)
```ts
export const config = {
  tiendaUrl: "https://donpedrohabana.com",
  tiendaZapatosUrl: "https://donpedrohabana.com/10-zapatos",
  avisoLegalUrl: "https://donpedrohabana.com/content/2-aviso-legal",
  privacidadUrl: "https://donpedrohabana.com/content/6-politica-de-privacidad",
  cookiesUrl: "https://donpedrohabana.com/content/7-politica-de-cookies",
  condicionesUrl: "https://donpedrohabana.com/content/8-terminos-y-condiciones-del-servicio",
  pacto: "Pídaselos tranquila: en casa puede probárselos igual que aquí en la tienda, y si no le convencen tiene 14 días para devolvérmelos.",
  pagos: "Pago con tarjeta, Bizum o transferencia.",
  envio: null,           // PENDIENTE de confirmar con el cliente (12 € España y Portugal vs. solo Madrid). Si es null, no se renderiza
  numRecomendaciones: 6,
  maxMasZapatos: 30,
  sonidoPorDefecto: false,
};
```

---

## 5. Especificación técnica

### 5.1 Stack
- **Next.js (App Router) + TypeScript + Tailwind**, exportación estática (`output: "export"`). Deploy en Vercel (preview).
- Estado del recorrido con `useReducer` y Context (sin librerías extra). Se guarda en `sessionStorage` (try/catch) para sobrevivir a un refresco. No hace falta más.
- Animaciones con CSS y la Web Animations API, o `framer-motion` si el constructor de cimientos lo justifica. Respeta `prefers-reduced-motion`.
- Sin IA y sin backend. **Sin datos personales:** no hay formularios ni cookies propias. Esto se revisará si se añade analítica (congelada).

### 5.2 Catálogo: sincronización
- **Fuente:** los listados de categoría de PrestaShop devuelven JSON si se piden con las cabeceras `Accept: application/json` y `X-Requested-With: XMLHttpRequest`:
  `GET https://donpedrohabana.com/{id}-{slug}?resultsPerPage=200&page=N`
  → `pagination.total_items`, más `rendered_products` (HTML con `<article class="js-product-miniature" data-id-product=… data-id-product-attribute=…>`).
  - De cada `<article>` se extrae: `id_product`, `id_product_attribute`, nombre (`h3 a[title]`), URL de la ficha (`a.product_img_link[href]`, **sin** el fragmento `#/…` de talla), imagen (`img[data-src]`, `home_default`; ampliable a `large_default`), precio (`span.price`, "98,00 €" → 98.00), precio anterior si existe (`.regular-price`), descripción corta (`.product-desc`).
  - La API oficial `/api/` responde 401 y no se usa.
- **Categorías a sincronizar:** salones 15, mocasines 16, sport 17, vestir 18, sandalias 19, alpargatas 20, botas 21, botines 22, zapatillas de casa 23, bailarinas 40, merceditas 48, zapatillas deportivas 51. Recuento aproximado a 2026-09-29, con variantes de color: 113, 78, 50, 75, 29, 34, 12, 47, 101, 79, 14, 5.
- **Script:** `scripts/sync-catalogo.mjs` (Node, sin dependencias pesadas; `cheerio` permitido) → `content/catalogo.json`. Se ejecuta en `prebuild` y a mano. Con pausa de 500 ms entre peticiones, `User-Agent` identificable y reintento ×2. **Si falla, conserva el último `catalogo.json` válido** y no rompe el build.
- **Deduplicado por modelo:** el mismo modelo aparece en varios colores (p. ej. "SALÓN CUÑA … NEGRO" y "… TAUPE"). `modelo` = nombre sin la palabra de color final (lista de colores en §5.4). En la cuadrícula de 6 **no puede haber dos productos del mismo modelo**; en "más zapatos", como mucho 2 por modelo.
- Un producto que esté en varias categorías se guarda una sola vez (por `id_product`), con todas sus categorías.

### 5.3 Etiquetado y recomendador (`lib/recomendador.ts`, determinista y testeado)
**Tipo de producto:**
```ts
type Producto = {
  id: number; idAtributo: number; nombre: string; modelo: string;
  url: string; imagen: string; precio: number; precioAnterior?: number;
  descripcion: string; categorias: number[];
  tacon: "plano" | "bajo" | "tacon" | null;
  color: "oscuros" | "claros" | "color" | null;
  estaciones: ("frio" | "entretiempo" | "calor")[];
};
```

**Etiquetas automáticas** (se revisan con `content/etiquetas-manuales.ts`, que tiene prioridad: `{ [id]: Partial<Etiquetas> }`):
- **tacón:**
  - Por categoría: bailarinas, sport, zapatillas deportivas, merceditas, alpargatas (salvo si pone "cuña"), zapatillas de casa y mocasines → `plano`.
  - Por palabras (nombre y descripción, sin tildes, en mayúsculas): "CUÑA", "TACON BAJO", "POCO TACON", "NO QUIEREN IR CON MUCHO TACON" → `bajo`; "TACON" (sin lo anterior) → `tacon`; "PLANO/A", "SIN TACON" → `plano`.
  - Salones, vestir, sandalias, botas y botines sin palabra clave → `null` (no filtra; puntúa 0).
- **color:** por la última palabra de color del nombre:
  - `oscuros`: NEGRO, MARRON, MARINO, AZUL MARINO, CUERO, CHOCOLATE, GRIS, ANTRACITA, BURDEOS
  - `claros`: BEIGE, BLANCO, CREMA, HIELO, TAUPE, NUDE, PIEDRA, CAMEL, ORO, PLATA, DORADO, PLATEADO, METALIZADO, BRONCE
  - `color`: ROJO, VERDE, AZUL, AMARILLO, NARANJA, ROSA, FUCSIA, MORADO, CELESTE, TURQUESA, MULTICOLOR, ESTAMPADO, LEOPARDO, SERPIENTE, COMBINADO
  - Sin coincidencia → `null`.
- **estaciones** por categoría: botas y botines → [frio]; sandalias y alpargatas → [calor]; bailarinas, merceditas → [entretiempo, calor]; salones, mocasines, sport, vestir, deportivas → [frio, entretiempo, calor] (todo el año); zapatillas de casa → todas. Las palabras "FORRO", "LANA", "BORREGO" o "ANTE" añaden `frio`.

**Categorías candidatas por respuesta** (ocasión × tiempo):
| Ocasión \ Tiempo | frio | entretiempo | calor |
|---|---|---|---|
| diario | botines 22, botas 21, mocasines 16, salones 15 | mocasines 16, salones 15, bailarinas 40, merceditas 48 | sandalias 19, alpargatas 20, bailarinas 40, mocasines 16 |
| celebracion | vestir 18, salones 15, botines 22 | vestir 18, salones 15 | vestir 18, sandalias 19, salones 15 |
| caminar | sport 17, deportivas 51, botines 22, mocasines 16 | sport 17, deportivas 51, mocasines 16 | sport 17, sandalias 19, alpargatas 20, deportivas 51 |
| casa | zapatillas de casa 23 (sin Q2 ni Q3) | — | — |

**Puntuación** (solo candidatos de esas categorías):
- +3 si `tacon` coincide; +1 si `tacon` es null; −5 si no coincide.
- +2 si `color` coincide o la respuesta es `todos`; +0,5 si `color` es null; 0 si no coincide.
- +1 si `estaciones` incluye la respuesta de Q2.
- +1 si la categoría es la **primera** de su fila de la tabla (prioridad de la casa).
- Desempate estable: precio descendente (se prioriza la marca propia de más calidad) y luego `id`. **Sin aleatoriedad**: las mismas respuestas dan el mismo resultado.

**Color (cambio 2026-09-30):** cada zapato lleva su **tono concreto** (`negro`, `marron`, `beige`, `blanco`, `gris`, `marino`, `burdeos`, `azul`, `rojo`, `rosa`, `verde`, `metal` u `otro`), el primero que nombra el nombre (`lib/etiquetado.ts → TONOS`). "Discretos" acepta `TONOS_DISCRETOS`; "Llamativos", el resto; "Uno en concreto", los tonos marcados. Un tono no aceptado resta 5 (excluye), como el tacón.

**Relajación, para garantizar 6 siempre:** si hay menos de 6 modelos distintos con puntuación ≥ 3 → 1) se ignora el color → 2) se permite `tacon` adyacente (plano↔bajo, bajo↔tacon) → 3) se añaden categorías de otras filas de la misma ocasión. Cada relajación queda registrada para la frase honesta de R1.

**"Ver toda la tienda"** → categoría de la primera celda de la fila elegida.

**Tests** (`lib/recomendador.test.ts`, con Vitest): las 3×3×3×4 + 4 = 112 combinaciones devuelven exactamente 6 modelos distintos con el `catalogo.json` real; los tests de etiquetado cubren palabras clave y overrides; y la misma entrada da la misma salida.

### 5.4 Imágenes
- Fotos de producto: **siempre las originales** de donpedrohabana.com (nunca generadas ni retocadas con IA). `next/image` con `unoptimized`, porque la exportación es estática, o `<img>` con `loading="lazy"` salvo las 6 primeras, que se precargan en E. `remotePatterns` para donpedrohabana.com.
- Ilustraciones propias: WebP y AVIF, con versión móvil (1080px de ancho) y escritorio (1920px).

### 5.5 Tracking (preparado, **congelado**)
- `lib/track.ts` exporta `track(evento, props)`. Hoy **no envía nada**: solo `console.debug` en desarrollo. Cuando se sepa el tráfico se conecta Meta Pixel/CAPI, GA4 o PostHog, **con banner de consentimiento**.
- Eventos ya instrumentados en el código:
  - `experiencia_vista` (F)
  - `puerta_abierta`
  - `saludo_completado`
  - `pregunta_respondida {n, id}`
  - `recomendaciones_vistas {respuestas, ids}` → ViewContent
  - `comprar_click {id, precio, posicion}` → equivalente a AddToCart intent
  - `mas_zapatos_click`
  - `ver_tienda_click`
  - `reinicio`
  - `error_catalogo`
- Enlaces a la tienda: **sin UTMs por ahora** (congelado). La función `urlTienda(url)` es el único punto por el que pasan, para añadirlas después.

### 5.6 Rendimiento y accesibilidad
- LCP < 2,5 s en 4G: la fachada se sirve en AVIF con prioridad, y la tienda interior se precarga durante F.
- Todo el recorrido se puede hacer con teclado. Las opciones son `<button>` con `aria-pressed`, el progreso tiene `aria-live`, las burbujas se anuncian (`aria-live="polite"`) y todas las imágenes decorativas llevan `alt=""`. La fachada lleva el alt "Fachada de la Zapatería Don Pedro, Paseo de la Habana 50".
- Contraste AA mínimo. En los botones marrón `#816040` sobre crema, **el texto del botón va en crema `#FBF7EA` o blanco, en negrita**; se verifica el ratio y, si no llega a 4,5:1, se oscurece el marrón a `#6B4F33`.
- Botón "Atrás" en cada pregunta (vuelve a la anterior conservando lo respondido).

---

## 6. Lista de assets

Estilo: se fija en la fase 5 (`arte/biblia.md`). Referencias reales en `arte/referencias/`: `blog-don-pedro.png` y `mql-foto1.jpg` (fachada), `mql-foto2.jpg` (interior), `logo.jpg`.

| # | Asset | Escena | Emoción | Notas |
|---|---|---|---|---|
| A1 | **Fachada** ilustrada, vertical (móvil 9:19,5) y horizontal (escritorio 16:9) | F | Calidez, orgullo de barrio, "tarde dorada en Madrid" | Fiel a la fachada real: rótulo cursivo marrón "Don Pedro", "CASA FUNDADA EN 1958", toldo marrón con "Zapatos - Bolsos - Complementos" en cursiva crema, aplacado claro, puerta y escaparate con marco marrón. **Cielo amplio** arriba para el título. Sin cámara de seguridad, alarma ni extintor |
| A2 | **Puerta** en capa separada (hoja que se abre) + interior entrevisto | T | Invitación | Para animar la apertura |
| A3 | **Interior de la tienda** (fondo) | S, Q, E | Acogida, orden, oficio | Estanterías con zapatos, bolsos colgados, mostrador de madera, suelo de baldosa clara. Zona libre para las tarjetas |
| A4 | **Don Pedro: saludo** | S | Cercanía | Cuerpo entero o medio cuerpo tras el mostrador, brazo abierto |
| A5 | **Don Pedro: escuchando** | Q1–Q4 | Atención | Gafas en la punta, cabeza ladeada, cinta de medir al cuello |
| A6 | **Don Pedro: contento** (reacción) | Q | Complicidad | Sonrisa, pulgar o gesto de "muy bien" |
| A7 | **Don Pedro: trastienda** | E | Anticipación | De perfil o de espaldas, con una caja de zapatos |
| A8 | **Don Pedro: señalando** (también recorte redondo en miniatura) | R1 | Orgullo, "mire lo que le he sacado" | Señala hacia abajo o a un lado |
| A9 | **Iconos Q1** ×4: bolso con llaves, invitación con lazo, plano o bastón de paseo, taza con zapatillas | Q1 | Reconocimiento | Mismo estilo, legibles a 96px |
| A10 | **Iconos Q2** ×3: bufanda y paraguas, hojas y gabardina, abanico y sol | Q2 | Humor ligero | |
| A11 | **Perfiles de zapato Q3** ×3: plano, cuña o tacón bajo, tacón | Q3 | Claridad | Silueta lateral con la altura marcada |
| A12 | **Muestras de piel Q4** ×4 (oscuros, claros, color, mezcla) | Q4 | Tacto, calidad | Circulares, con textura de piel |
| A13 | **Marco de la pared** para las reseñas | R3 | Confianza | Marco dorado `#CEB888` sobre pared |
| A14 | **Progreso**: zapatito ×2 estados (vacío y lleno) | Q | Avance | Pequeño |
| A15 | **Sonido**: campanilla de puerta (0,8 s) | T | Bienvenida | Licencia libre (CC0) o grabada. Se registra la fuente |

**Nunca:** generar con IA zapatos o bolsos presentados como producto de la tienda. Los zapatos que aparezcan en ilustraciones (escaparate, estanterías, iconos) son genéricos y decorativos, y no se venden. Tampoco imitar estilos protegidos (Pixar, Ghibli…).

**Sustituibilidad de Don Pedro:** las poses de Don Pedro (A4–A8) se referencian **solo** desde `content/personaje.ts` (`{ nombre: "Don Pedro", poses: { saludo, escuchando, contento, trastienda, senalando } }`), para poder cambiar las imágenes y el nombre si las nietas no lo aprueban.

---

## 7. Plan de construcción

### Estructura
```
app/                 layout.tsx, page.tsx, globals.css
components/base/     Boton, Burbuja, TarjetaOpcion, BarraProgreso, BotonSonido, Escena (wrapper de fondo)   ← cimientos
lib/                 estado.tsx (reducer+context), track.ts, urls.ts, texto.ts (tipo oración, saludo por hora)   ← cimientos
lib/recomendador.ts, lib/etiquetado.ts, lib/*.test.ts                                                  ← M2
scripts/sync-catalogo.mjs                                                                              ← M2
content/config.ts, textos.ts, personaje.ts, resenas.ts                                                 ← cimientos
content/catalogo.json, content/etiquetas-manuales.ts                                                   ← M2
types/index.ts                                                                                         ← cimientos
escenas/Fachada.tsx, escenas/Entrada.tsx                                                               ← M3
escenas/Saludo.tsx, escenas/Pregunta.tsx, escenas/Trastienda.tsx                                       ← M4
escenas/Recomendaciones.tsx, components/resultados/*                                                   ← M5
public/arte/**                                                                                         ← fase 5 (placeholders en cimientos)
```

### Módulos y orden
1. **Cimientos** (`constructor-cimientos`): scaffold, tokens Tailwind (§4.1), fuentes, componentes base, estado (fases `fachada → entrada → saludo → q1..q4 → trastienda → resultados`, respuestas, retroceso, `sessionStorage`), tipos (incluido `Producto`), `content/*.ts` con los textos literales de §2, `track.ts` y `urls.ts`, y **placeholders** SVG para todos los assets de §6 con las rutas definitivas. `page.tsx` monta la máquina de estados y renderiza la escena activa por import, con escenas vacías (stubs) que solo tienen su nombre.
2. En paralelo tras cimientos (cada uno en su worktree):
   - **M2 Catálogo y recomendador:** script de sincronización, `catalogo.json` real, etiquetado, recomendador y tests (§5.2–5.3). **Terminado cuando:** las 112 combinaciones devuelven 6 modelos distintos y los tests están en verde.
   - **M3 Fachada y entrada:** pantallas F y T.
   - **M4 Don Pedro y quiz:** pantallas S, Q1–Q4 y E (incluye el salto de Q2 y Q3 con `casa`, las reacciones, el "Atrás" y "Saltar").
   - **M5 Recomendaciones:** R1–R5, consumiendo `recomendar(respuestas)` de M2 a través de la firma pactada en `types/index.ts`: `recomendar(r: Respuestas): { top: Producto[]; mas: Producto[]; relajaciones: Relajacion[]; urlTienda: string }`. Mientras M2 no esté, se usa un mock con la misma firma.
3. **Integración** (sesión principal): une todo, sustituye el mock, prueba el flujo completo a 375px y hace el deploy de preview.

**Archivos compartidos:** solo cimientos toca `app/`, `components/base/`, `lib/estado.tsx`, `lib/track.ts`, `lib/urls.ts`, `lib/texto.ts`, `content/config.ts`, `textos.ts`, `personaje.ts`, `resenas.ts` y `types/`. Si una escena necesita un cambio ahí, lo anota en su devolución y lo aplica la integración.

---

## 8. Riesgos
| Riesgo | Mitigación |
|---|---|
| El HTML de PrestaShop cambia (tema o versión) y el scraping falla | El build conserva el último `catalogo.json` válido. El script falla de forma ruidosa en CI. Selectores centralizados en un solo objeto |
| Un producto recomendado se agota o se retira | Sincronización en cada build + rebuild programado (diario, cuando haya hosting final). La ficha de PrestaShop gestiona tallas agotadas |
| Etiquetado de tacón o color impreciso | Palabras clave + `etiquetas-manuales.ts` + revisión manual de los modelos que más salen (listado en el script: `--informe`) |
| Recomendaciones repetitivas (mismo modelo en colores) | Deduplicado por modelo (§5.2) |
| Hotlink de imágenes de donpedrohabana.com lento o bloqueado | Precarga en E. Plan B: descargar las imágenes en la sincronización a `public/catalogo/` |
| A las nietas no les gusta la caricatura | Personaje aislado en `content/personaje.ts` (§6) |
| Tráfico frío si al final es Meta | Revisar F y S cuando se descongele (más dolor antes del saludo) |
| El proceso de compra de PrestaShop obliga a crear una cuenta con contraseña y preselecciona la talla 35 | Fuera del alcance de la landing. **Recomendar al cliente** activar la compra como invitada y la opción "Elija su talla". Medir el abandono tras `comprar_click` cuando haya analítica |
| Legal | Sin datos personales ni cookies propias hoy. Al activar la analítica: banner de consentimiento y política de privacidad. Pedir las URLs de aviso legal y privacidad al cliente |
| Uso comercial de la fachada | Es su propia fachada. Las fotos de referencia son de terceros y **solo se usan como referencia**, nunca se publican |
