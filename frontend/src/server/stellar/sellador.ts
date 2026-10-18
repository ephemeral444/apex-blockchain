import { BASE_FEE, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { cuentaInstitucional, horizon, RED } from "./cliente";

/**
 * Anclaje de sellos en Stellar testnet con la operación nativa Manage Data:
 * la entrada `clave -> hash` queda asociada a la cuenta institucional y es
 * pública y consultable por cualquier auditor en el explorador.
 *
 * Los envíos se serializan en una fila en memoria para que dos sellos
 * simultáneos no compitan por el número de secuencia de la cuenta.
 */

let fila: Promise<unknown> = Promise.resolve();

export function sellarDato(clave: string, hashHex: string): Promise<string> {
  const tarea = fila.then(
    () => enviar(clave, hashHex),
    () => enviar(clave, hashHex),
  );
  // La fila nunca se rompe: un fallo aislado no arrastra los siguientes sellos.
  fila = tarea.catch(() => undefined);
  return tarea;
}

async function enviar(clave: string, hashHex: string): Promise<string> {
  try {
    return await enviarUnaVez(clave, hashHex);
  } catch (error) {
    if (esErrorSecuencia(error)) return await enviarUnaVez(clave, hashHex);
    throw error;
  }
}

async function enviarUnaVez(clave: string, hashHex: string): Promise<string> {
  const institucional = cuentaInstitucional();
  const cuenta = await horizon.loadAccount(institucional.publicKey());
  const transaccion = new TransactionBuilder(cuenta, {
    fee: BASE_FEE,
    networkPassphrase: RED,
  })
    .addOperation(
      Operation.manageData({
        name: clave,
        // El sello SHA-256 ocupa exactamente 32 bytes binarios de los 64 permitidos.
        value: Buffer.from(hashHex, "hex"),
      }),
    )
    .setTimeout(30)
    .build();
  transaccion.sign(institucional);
  const respuesta = await horizon.submitTransaction(transaccion);
  return respuesta.hash;
}

function esErrorSecuencia(error: unknown): boolean {
  return error instanceof Error && error.message.includes("tx_bad_seq");
}
