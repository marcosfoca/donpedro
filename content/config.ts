export const config = {
  tiendaUrl: "https://donpedrohabana.com",
  tiendaZapatosUrl: "https://donpedrohabana.com/10-zapatos",
  avisoLegalUrl: "https://donpedrohabana.com/content/2-aviso-legal",
  privacidadUrl: "https://donpedrohabana.com/content/6-politica-de-privacidad",
  cookiesUrl: "https://donpedrohabana.com/content/7-politica-de-cookies",
  condicionesUrl: "https://donpedrohabana.com/content/8-terminos-y-condiciones-del-servicio",
  // R2b: dos burbujas cortas. La primera prepara la ficha de PrestaShop (talla preseleccionada).
  // Coste de la recogida en devoluciones: NO se menciona (decisión del usuario, 2026-09-29).
  pacto: [
    "En la ficha, fíjese bien en su talla.",
    "Se los prueba en casa, como aquí, y si no le convencen tiene 14 días para devolvérmelos.",
  ],
  pagos: "Pago con tarjeta, Bizum o transferencia.",
  envio: null as string | null, // PENDIENTE de confirmar con el cliente (12 € España y Portugal vs. solo Madrid). Si es null, no se renderiza
  numRecomendaciones: 6,
  maxMasZapatos: 30,
  sonidoPorDefecto: false,
};
