"use client";
import { useEffect, useRef } from "react";
import { BotonSonido } from "@/components/base/BotonSonido";
import { textos } from "@/content/textos";
import { EstadoProvider, esPregunta, useEstado } from "@/lib/estado";
import Fachada from "@/escenas/Fachada";
import Entrada from "@/escenas/Entrada";
import Saludo from "@/escenas/Saludo";
import Pregunta from "@/escenas/Pregunta";
import Trastienda from "@/escenas/Trastienda";
import Recomendaciones from "@/escenas/Recomendaciones";

function EscenaActiva() {
  const { fase } = useEstado();
  if (fase === "fachada") return <Fachada />;
  if (fase === "entrada") return <Entrada />;
  if (fase === "saludo") return <Saludo />;
  if (esPregunta(fase)) return <Pregunta key={fase} pregunta={fase} />;
  if (fase === "trastienda") return <Trastienda />;
  return <Recomendaciones />;
}

function Escenario() {
  const { fase, hidratado } = useEstado();
  const main = useRef<HTMLElement>(null);
  const primera = useRef(true);
  const hidratacionVista = useRef(false);

  // Al cambiar de escena: arriba del todo y foco al contenedor (teclado y lectores de pantalla).
  // El salto de fase que provoca la hidratación (usuaria que vuelve a mitad de recorrido) no
  // cuenta: ni sube la página ni roba el foco; resultados restaura su propia posición.
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (!hidratacionVista.current) {
      if (!hidratado) return;
      hidratacionVista.current = true;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [fase, hidratado]);

  return (
    <main ref={main} tabIndex={-1} aria-label={textos.accesible.principal} className="outline-none" data-fase={fase}>
      {/* En resultados no suena nada y el botón tapa la cabecera y las tarjetas. */}
      {fase !== "resultados" ? <BotonSonido /> : null}
      <EscenaActiva />
    </main>
  );
}

export default function Pagina() {
  return (
    <EstadoProvider>
      <Escenario />
    </EstadoProvider>
  );
}
