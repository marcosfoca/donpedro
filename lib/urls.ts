/**
 * Punto ÚNICO por el que pasan todos los enlaces a donpedrohabana.com (diseno.md §5.5).
 * Hoy devuelve la URL tal cual (UTMs congelados). Cuando se descongele el tráfico,
 * aquí se añaden los parámetros sin tocar ningún componente.
 */
export function urlTienda(url: string): string {
  return url;
}
