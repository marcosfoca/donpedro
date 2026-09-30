import { assets } from "@/content/assets";
import { textos } from "@/content/textos";

export type BarraProgresoProps = {
  /** 1-based. */
  paso: number;
  /** 4, o 2 si la ocasión es "casa". Úsese useEstado().progreso. */
  total: number;
  className?: string;
};

/** Zapatitos de progreso ("1 de 4") con aria-live para lectores de pantalla. */
export function BarraProgreso({ paso, total, className = "" }: BarraProgresoProps) {
  return (
    <div className={`pastilla flex items-center gap-3 py-1 ${className}`}>
      <ol className="flex items-center gap-1.5 [[data-letra-grande]_&]:hidden" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={i < paso ? assets.progreso.lleno : assets.progreso.vacio}
              alt=""
              width={32}
              height={20}
              className="h-5 w-8"
            />
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="font-sans text-base font-bold text-tinta">
        <span aria-hidden="true" className="whitespace-nowrap">{textos.quiz.progreso(paso, total)}</span>
        <span className="sr-only">{textos.quiz.progresoAccesible(paso, total)}</span>
      </p>
    </div>
  );
}
