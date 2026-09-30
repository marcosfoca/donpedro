# Entrega — "Don Pedro le atiende" (Zapatería Don Pedro)

**Enlace para probar:** https://donpedro-seven.vercel.app
**Código:** https://github.com/marcosfoca/donpedro (rama `main`)

## Qué es
Una experiencia web para móvil que atiende a la clienta como en la tienda. Don Pedro, el fundador de 1958 dibujado como zapatero, la recibe en la puerta, le hace 4 preguntas y le saca 6 zapatos reales del catálogo de donpedrohabana.com. La tarjeta de cada zapato lleva a su ficha de la tienda, donde se elige la talla y se compra.

Recorrido:
1. **Fachada** (de día o de noche según la hora) → **abrir la puerta**.
2. **Saludo** de Don Pedro, frase a frase.
3. **4 preguntas:**
   - Ocasión.
   - Tiempo.
   - Tacón.
   - Color: discretos / llamativos / cualquiera / uno en concreto, que abre 12 muestras.
   - Con "para estar en casa" se saltan el tiempo y el tacón.
4. **Trastienda:**
   - Don Pedro resume lo que ha entendido.
   - Recuerda la talla y los 14 días para devolver.
   - Aparece "Ver los zapatos".
5. **Recomendaciones:**
   - Las 6 elegidas.
   - "Más zapatos para usted".
   - "Ver toda la tienda".

Sin IA en tiempo real, sin datos personales y sin cookies propias. El recomendador es determinista: lo que Don Pedro dice ("en negro", "planos", "en días de frío") se cumple, y si tiene que completar con otra cosa lo avisa.

## Variables de entorno
**Hoy no hace falta ninguna** para compilar ni para publicar. La analítica está preparada pero congelada (`lib/track.ts`). Cuando se active, sus claves irán en variables de entorno, como indica `.env.example`, y habrá que añadir un banner de consentimiento.

`.env.local` solo se usa en local para las herramientas de la agencia (generar arte con Gemini y el consejo de decisiones). No se sube a git ni se necesita en Vercel.

## Cómo se editan los textos y el contenido
Todo está en la carpeta `content/`, sin tocar componentes. Después de editar, se publica como se explica abajo.

| Qué | Dónde |
|---|---|
| Frases de Don Pedro, preguntas, opciones, reacciones, botones, errores, 404, textos para lectores de pantalla, título y descripción de la página | `content/textos.ts` |
| Resumen de la trastienda ("Para su celebración, en días de frío…"): plantillas y fragmentos | `content/textos.ts` → `resultados.plantilla`, `resultados.fragmentos` |
| El pacto (talla y 14 días), URLs de la tienda y de las páginas legales, número de recomendaciones, tope de "Más zapatos", sonido por defecto | `content/config.ts` |
| Nombre, poses y descripciones del personaje (sustituible por otra ilustración) | `content/personaje.ts` y `public/arte/don-pedro/` |
| Rutas de las ilustraciones, iconos y muestras de color | `content/assets.ts` y `public/arte/` |
| Correcciones a mano del tacón, color, temporada o modelo de un zapato concreto | `content/etiquetas-manuales.ts` (por id de producto) |
| Palabras de color del catálogo y qué cuenta como "discreto" | `lib/etiquetado.ts` → `TONOS`, `TONOS_DISCRETOS` |

Reglas de voz para cualquier texto nuevo (`docs/diseno.md` §1):
- Don Pedro trata de usted y habla en español de España.
- Frases de dos líneas como mucho; las reacciones, de 40 caracteres o menos.
- Nada de urgencia, descuentos inventados ni "devolución gratis".

## El catálogo
- Se sincroniza solo desde los listados de donpedrohabana.com cada vez que se compila (`npm run build`). Si la web falla, se conserva el catálogo anterior.
- `node scripts/sync-catalogo.mjs --informe` lista los zapatos sin tacón o sin color reconocido, para corregirlos en `content/etiquetas-manuales.ts`.
- `node scripts/sync-catalogo.mjs --reetiquetar` vuelve a etiquetar el catálogo actual sin descargarlo, tras editar las reglas o las correcciones manuales.

## Cómo se publica
1. `npm install` (una vez) y `npm test` (507 pruebas, entre ellas una que recorre todas las combinaciones de respuestas y comprueba que ningún zapato contradice lo que dice Don Pedro).
2. `npm run build`. Genera la web estática en `out/`. Hay que parar antes `npm run dev` y cualquier servidor que esté sirviendo `out/`.
3. Copiar `out/` a una carpeta llamada `donpedro` y, dentro, ejecutar `vercel deploy . --prod --yes` con la cuenta de Vercel de la agencia.

Mejora recomendada: conectar el repositorio de GitHub al proyecto `donpedro` en el panel de Vercel, para que publique solo con cada push.

Para probar en local: `npm run dev` (http://localhost:3000) o `npx serve out -l 4180` (sirve el build).

## Pendiente
- **Del cliente:**
  - **Envío.** Confirmar la zona y el coste, porque las condiciones se contradicen: 12 € a España y Portugal frente a solo Madrid. Hoy no se menciona en ningún sitio.
  - **Dominio final.**
  - **Origen del tráfico,** para activar la analítica, los píxeles y las UTM (congelado).
- **Teléfono de ayuda:** el pie dice "¿Le ayudamos? Llame a la tienda: 915 636 367". Confirmar que es el número que quieren y si añadir el horario (`content/config.ts` → `telefono`).
- **Prueba con personas mayores reales:** recomendamos observar a 3–5 clientas usándola antes de lanzar, para ver dónde dudan.
- **Recomendaciones para la tienda:**
  - Permitir comprar sin registrarse en PrestaShop.
  - Que la ficha no traiga la talla 35 preseleccionada, sino "Elija su talla".
- **Del contenido:** las reseñas autorizadas (`content/resenas.ts`) se conservan, pero no se muestran por decisión del usuario.

## Documentos del proyecto
- `docs/descubrimiento.md`, `docs/narrativa.md`, `docs/conceptos.md` y `docs/diseno.md`: el proceso y el diseño.
- `docs/decisiones/`: las consultas al consejo de modelos.
- `docs/auditorias/`: auditorías de persuasión, voz y móvil.
- `arte/biblia.md`: el estilo visual y cómo se generó el arte.
