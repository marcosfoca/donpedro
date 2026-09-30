import type { Metadata } from "next";
import { Boton, CuadroDialogo, EscenaTienda } from "@/components/base";
import { textos } from "@/content/textos";

export const metadata: Metadata = { title: textos.errores.noEncontrada.titulo };

/** 404 dicho por Don Pedro (regla de voz 9): en español, dentro de la tienda y frase a frase. */
export default function NoEncontrada() {
  const t = textos.errores.noEncontrada;
  return (
    <main>
      <EscenaTienda
        etiqueta={t.titulo}
        pose="apurado"
        dialogo={<CuadroDialogo textos={t.burbujas} />}
        pie={
          <Boton href="/" className="accion-destacada">
            {t.cta}
          </Boton>
        }
      />
    </main>
  );
}
