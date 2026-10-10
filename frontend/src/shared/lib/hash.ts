import { serializar } from "@/shared/lib/serialize";

/**
 * Calcula el sello criptográfico (SHA-256) del contenido de un registro.
 * Es criptografía real del navegador: dos contenidos idénticos producen el
 * mismo sello y cualquier cambio, por mínimo que sea, lo altera por completo.
 */
export async function calcularSello(contenido: Record<string, unknown>): Promise<string> {
  const datos = new TextEncoder().encode(serializar(contenido));
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Genera un identificador de respaldo externo con aspecto de hash de red. */
export function generarIdRespaldo(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
