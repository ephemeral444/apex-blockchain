/**
 * Almacenamiento local del prototipo con respaldo en memoria.
 * Sustituye a la base de datos real: en la semana 4 los repositorios
 * migran a datos reales y este módulo deja de usarse.
 */
export const CLAVES = {
  sesion: "dc.sesion",
  pacientes: "dc.pacientes",
  atenciones: "dc.atenciones",
  verificaciones: "dc.verificaciones",
} as const;

export const EVENTO_DATOS = "dc:datos-actualizados";

const respaldoMemoria = new Map<string, string>();

function almacen(): Pick<Storage, "getItem" | "setItem" | "removeItem"> | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {
    // localStorage bloqueado (modo privado, etc.)
  }
  return null;
}

export function leer<T>(clave: string, valorPorDefecto: T): T {
  const a = almacen();
  const crudo = a ? a.getItem(clave) : respaldoMemoria.get(clave) ?? null;
  if (crudo === null) return valorPorDefecto;
  try {
    return JSON.parse(crudo) as T;
  } catch {
    return valorPorDefecto;
  }
}

export function guardar(clave: string, valor: unknown): void {
  const crudo = JSON.stringify(valor);
  const a = almacen();
  if (a) a.setItem(clave, crudo);
  else respaldoMemoria.set(clave, crudo);
  anunciarCambio();
}

export function eliminarClave(clave: string): void {
  const a = almacen();
  if (a) a.removeItem(clave);
  else respaldoMemoria.delete(clave);
}

export function anunciarCambio(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENTO_DATOS));
}

export function suscribirCambios(escucha: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENTO_DATOS, escucha);
  return () => window.removeEventListener(EVENTO_DATOS, escucha);
}
