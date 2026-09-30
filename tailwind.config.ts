import type { Config } from "tailwindcss";
import { colores, movimiento, tamanos } from "./lib/tokens";

/** px de diseño → rem (la raíz mide 18 px por defecto: html { font-size: 112.5% }). */
const rem = (px: number) => `${+(px / 18).toFixed(4)}rem`;

const config: Config = {
  // En táctil, :hover se queda "pegado" tras tocar y la tarjeta siguiente parecía preseleccionada.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./escenas/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cuero: { DEFAULT: colores.cuero, oscuro: colores.cueroOscuro },
        crema: { DEFAULT: colores.crema },
        fondo: colores.fondo,
        dorado: colores.dorado,
        marino: colores.marino,
        tinta: colores.tinta,
        gris: { DEFAULT: colores.gris, claro: colores.grisClaro },
      },
      fontFamily: {
        serif: ["var(--font-vollkorn)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // En rem (1 rem = 18 px por defecto): crecen con la letra que tenga configurada la persona.
        base: [rem(tamanos.textoBase), { lineHeight: "1.5" }],
        burbuja: [rem(tamanos.textoBurbuja), { lineHeight: "1.4" }],
        boton: [rem(tamanos.textoBoton), { lineHeight: "1.2" }],
        precio: [rem(20), { lineHeight: "1.2" }],
        nombre: [rem(18), { lineHeight: "1.3" }],
        // Una sola línea a 375px ("Don Pedro le atiende"), para que título, promesa y botón quepan en el cielo.
        titulo: ["clamp(1.9rem, 8.4vw, 4rem)", { lineHeight: "1.05" }],
        subtitulo: ["clamp(1.25rem, 4.8vw, 1.75rem)", { lineHeight: "1.3" }],
      },
      minHeight: {
        boton: rem(tamanos.altoBoton),
        "boton-tarjeta": rem(tamanos.altoBotonTarjeta),
        tactil: rem(tamanos.zonaTactil),
        pantalla: "100dvh",
        "tarjeta-resultado": `${tamanos.tarjetaResultadoMinAlto}px`,
      },
      minWidth: { tactil: rem(tamanos.zonaTactil) },
      maxWidth: { resultados: `${tamanos.anchoMaximoResultados}px` },
      height: { pantalla: "100dvh" },
      transitionTimingFunction: { suave: movimiento.easing },
      keyframes: {
        aparecer: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fundido: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        // Cada frase de Don Pedro "sale" de él: crece desde el pico, de abajo arriba.
        dialogo: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.94)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // "Toque para seguir": se mueve hacia la derecha y late, sin parar, para que se vea.
        pista: {
          "0%, 100%": { transform: "translateX(0)", opacity: "1" },
          "50%": { transform: "translateX(5px)", opacity: "0.75" },
        },
        punto: {
          "0%, 80%, 100%": { opacity: "0.25" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        aparecer: `aparecer ${movimiento.aparicionMs}ms ${movimiento.easing} both`,
        fundido: `fundido ${movimiento.fundidoReducidoMs}ms ease-out both`,
        dialogo: `dialogo 380ms cubic-bezier(0.34, 1.4, 0.64, 1) both`,
        pista: "pista 1.1s ease-in-out infinite",
        punto: "punto 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
