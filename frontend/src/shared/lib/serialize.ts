/**
 * Serialización determinística (claves ordenadas de forma recursiva).
 * Garantiza que el mismo contenido clínico produzca siempre el mismo sello,
 * sin importar el orden en que se construyó el objeto. Es la versión simple
 * del estándar canónico que usa el backend real del Blueprint.
 */
export function serializar(valor: unknown): string {
  if (valor === undefined) return "null";
  if (valor === null || typeof valor !== "object") return JSON.stringify(valor) ?? "null";
  if (Array.isArray(valor)) return `[${valor.map(serializar).join(",")}]`;
  const entradas = Object.entries(valor as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entradas.map(([k, v]) => `${JSON.stringify(k)}:${serializar(v)}`).join(",")}}`;
}
