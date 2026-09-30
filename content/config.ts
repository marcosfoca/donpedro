export const config = {
  tiendaUrl: "https://donpedrohabana.com",
  tiendaZapatosUrl: "https://donpedrohabana.com/10-zapatos",
  avisoLegalUrl: "https://donpedrohabana.com/content/2-aviso-legal",
  privacidadUrl: "https://donpedrohabana.com/content/6-politica-de-privacidad",
  cookiesUrl: "https://donpedrohabana.com/content/7-politica-de-cookies",
  condicionesUrl: "https://donpedrohabana.com/content/8-terminos-y-condiciones-del-servicio",
  // El pacto: Don Pedro lo dice en la trastienda, después del resumen y antes de "Ver los zapatos"
  // (petición del usuario, 2026-09-30; texto del agente de persuasión). Condiciones reales: se prueba
  // en casa y tiene 14 días; la única excepción son los zapatos personalizados o a medida. La talla
  // primero, porque la ficha de PrestaShop trae una preseleccionada. El coste de la recogida NO se
  // menciona (decisión del usuario, 2026-09-29) y nunca se dice que devolver sea gratis.
  // "14 días" lleva espacio no separable. "zapatillas" = ocasión "casa" (femenino).
  pacto: {
    zapatos: ["Fíjese en su talla, y en casa se los prueba como aquí.", "Si no le quedan bien, tiene 14\u00a0días para devolvérmelos."],
    zapatillas: ["Fíjese en su talla, y en casa se las prueba como aquí.", "Si no le quedan bien, tiene 14\u00a0días para devolvérmelas."],
  },
  /** No se muestra (petición del usuario: pacto breve); PrestaShop ya enseña los pagos al pagar. */
  pagos: "Pago con tarjeta, Bizum o transferencia.",
  /** Teléfono de ayuda del pie (el fijo público de la tienda). Confirmar con el cliente. */
  telefono: { visible: "915 636 367", enlace: "tel:+34915636367" },
  envio: null as string | null, // PENDIENTE de confirmar con el cliente (12 € España y Portugal vs. solo Madrid). Si es null, no se renderiza
  numRecomendaciones: 6,
  maxMasZapatos: 30,
  sonidoPorDefecto: false,
};
