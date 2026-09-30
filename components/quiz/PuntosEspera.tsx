/**
 * Tres puntos animados de espera (pantalla E). Decorativos: la burbuja ya se anuncia.
 * Con prefers-reduced-motion, globals.css los deja fijos (sin parpadeo).
 */
export function PuntosEspera({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      {[0, 200, 400].map((retraso) => (
        <span
          key={retraso}
          className="h-4 w-4 animate-punto rounded-full bg-cuero"
          style={{ animationDelay: `${retraso}ms` }}
        />
      ))}
    </div>
  );
}
