import { Horizon, Keypair, Networks } from "@stellar/stellar-sdk";

/**
 * Acceso del servidor a la red de pruebas de Stellar. La llave privada de la
 * cuenta institucional nunca sale de las variables de entorno del backend:
 * el navegador solo conoce la llave pública (para enlazar al explorador).
 */

const HORIZON_URL = process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const horizon = new Horizon.Server(HORIZON_URL, { allowHttp: false });

export const RED = Networks.TESTNET;

export function cuentaInstitucional(): Keypair {
  const secreta = process.env.STELLAR_SECRET_KEY;
  if (!secreta) {
    throw new Error("STELLAR_SECRET_KEY no está configurada en el servidor.");
  }
  return Keypair.fromSecret(secreta);
}

export function publicKeyInstitucional(): string {
  return cuentaInstitucional().publicKey();
}
