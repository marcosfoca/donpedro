import { config } from "@/content/config";
import { textos } from "@/content/textos";
import { urlTienda } from "@/lib/urls";

/** Pie legal global (lo monta app/layout.tsx bajo todas las escenas). M5 no debe repetirlo. */
export function Pie() {
  const enlaces = [
    { href: config.tiendaUrl, texto: textos.pie.tienda },
    { href: config.avisoLegalUrl, texto: textos.pie.avisoLegal },
    { href: config.privacidadUrl, texto: textos.pie.privacidad },
    { href: config.cookiesUrl, texto: textos.pie.cookies },
    { href: config.condicionesUrl, texto: textos.pie.condiciones },
  ];
  return (
    <footer className="relative z-10 border-t-2 border-dorado bg-fondo px-4 py-6 text-center font-sans text-base text-gris">
      <p className="mb-3 text-tinta">
        {textos.pie.ayuda}{" "}
        <a
          href={config.telefono.enlace}
          className="inline-flex min-h-tactil items-center whitespace-nowrap font-bold text-cuero-oscuro underline underline-offset-4 hover:text-tinta"
        >
          {config.telefono.visible}
        </a>
      </p>
      <p>{textos.pie.texto}</p>
      <nav aria-label={textos.pie.etiquetaNav} className="mt-3">
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={urlTienda(e.href)}
                className="inline-flex min-h-tactil items-center px-2 text-cuero-oscuro underline underline-offset-4 hover:text-tinta"
              >
                {e.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
