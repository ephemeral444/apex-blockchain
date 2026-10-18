/**
 * Convenciones compartidas entre el front y el back para hablar de la red
 * externa sin exponer detalles de blockchain al usuario:
 * qué clave usa cada atención en la red y cómo se enlaza al explorador
 * público (Stellar Expert, red de pruebas).
 */

/** Cuenta institucional que ancla los sellos; su llave privada vive solo en el servidor. */
export const CUENTA_INSTITUCIONAL = process.env.NEXT_PUBLIC_STELLAR_ACCOUNT ?? "";

const EXPLORADOR_TESTNET = "https://stellar.expert/explorer/testnet";

/** Clave bajo la que queda anclado el sello de una atención (máx. 64 bytes en la red). */
export function claveDeAtencion(idAtencion: string): string {
  return `dc-${idAtencion}`;
}

export function enlaceTransaccion(hash: string): string {
  return `${EXPLORADOR_TESTNET}/tx/${hash}`;
}

export function enlaceCuentaInstitucional(): string {
  return `${EXPLORADOR_TESTNET}/account/${CUENTA_INSTITUCIONAL}`;
}
