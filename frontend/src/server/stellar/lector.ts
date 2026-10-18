import { horizon, publicKeyInstitucional } from "./cliente";

export interface DatoAnclado {
  encontrado: boolean;
  /** Sello anclado en la red, en hex, cuando la entrada existe. */
  hashHex?: string;
  cuenta: string;
}

/**
 * Lee la entrada Manage Data de una atención directamente del ledger vía
 * Horizon: es la copia pública e inmutable contra la que el auditor
 * contrasta el sello local.
 */
export async function leerDatoAnclado(clave: string): Promise<DatoAnclado> {
  const cuenta = publicKeyInstitucional();
  const respuesta = await horizon.loadAccount(cuenta);
  const crudo = respuesta.data_attr[clave];
  if (!crudo) return { encontrado: false, cuenta };
  // Horizon entrega el valor en base64; se normaliza a hex para comparar
  // con el sello local.
  const bytes = typeof crudo === "string" ? Buffer.from(crudo, "base64") : Buffer.from(crudo);
  return { encontrado: true, hashHex: bytes.toString("hex"), cuenta };
}
