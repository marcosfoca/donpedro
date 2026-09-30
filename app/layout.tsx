import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Vollkorn } from "next/font/google";
import { Pie } from "@/components/base/Pie";
import { assets } from "@/content/assets";
import { textos } from "@/content/textos";
import { colores } from "@/lib/tokens";
import "./globals.css";

const vollkorn = Vollkorn({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-vollkorn",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  // URL pública para las previsualizaciones al compartir (WhatsApp, redes). Cambiar al fijar dominio.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://donpedro-seven.vercel.app"),
  title: textos.meta.titulo,
  description: textos.meta.descripcion,
  openGraph: {
    title: textos.meta.titulo,
    description: textos.meta.descripcion,
    images: [{ url: assets.fachada.dia.escritorio, width: 1376, height: 768, alt: textos.fachada.altFachada }],
    locale: "es_ES",
    type: "website",
  },
  robots: { index: false, follow: false }, // preview: se revisa al fijar dominio
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: colores.cuero,
};

/**
 * Se ejecuta antes de pintar (en <head>):
 * 1) <html data-momento="dia|noche">: mismo corte que "Buenas noches" (21–6 h). La fachada y los
 *    textos del cielo se eligen por CSS con este atributo, así solo se descarga la que toca, y se
 *    precarga con prioridad alta.
 * 2) <html data-reanudar>: si había un recorrido empezado en esta pestaña (sessionStorage), la
 *    fachada estática no se enseña mientras la app se hidrata y salta a su escena.
 * Debe coincidir con lib/texto.ts (esDeNoche), lib/momento.ts y la clave de lib/estado.tsx.
 */
const SCRIPT_INICIO = `(function(){try{
var d=document.documentElement,h=new Date().getHours(),m=(h>=21||h<6)?"noche":"dia";
d.dataset.momento=m;
var F=${JSON.stringify(assets.fachada)};
var e=window.matchMedia&&window.matchMedia("(min-width: 768px)").matches;
var l=document.createElement("link");l.rel="preload";l.as="image";l.href=F[m][e?"escritorio":"movil"];
l.setAttribute("fetchpriority","high");document.head.appendChild(l);
var s=sessionStorage.getItem("donpedro:estado:v1");
if(s){var j=JSON.parse(s);if(j&&j.fase&&j.fase!=="fachada")d.dataset.reanudar="1";}
}catch(_){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-ES" className={`${vollkorn.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIO }} />
      </head>
      <body>
        {children}
        <Pie />
      </body>
    </html>
  );
}
