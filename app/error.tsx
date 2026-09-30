"use client";
import { Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { textos } from "@/content/textos";

/**
 * Error inesperado de la aplicación, dicho por Don Pedro en la tienda. "Volver a empezar" borra el
 * recorrido guardado de esta pestaña y recarga desde la entrada.
 */
export default function ErrorAplicacion() {
  const t = textos.errores.aplicacion;
  const volver = () => {
    try {
      sessionStorage.removeItem("donpedro:estado:v1");
    } catch {
      // sin sessionStorage basta con recargar
    }
    window.location.assign("/");
  };
  return (
    <main>
      <EscenaTienda
        etiqueta={t.cta}
        pose="apurado"
        dialogo={<CuadroDialogo textos={t.burbujas} />}
        pie={
          <Boton onClick={volver} className="accion-destacada">
            {t.cta}
          </Boton>
        }
      />
    </main>
  );
}
