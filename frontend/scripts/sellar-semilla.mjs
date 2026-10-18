import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BASE_FEE,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { PACIENTES_DEMO, PLANTILLAS_ATENCIONES_DEMO } from "../src/bootstrap/datos-demo.ts";

/**
 * Ancla en Stellar testnet los sellos de las atenciones demo, una transacción
 * Manage Data por atención, y deja el resultado en src/bootstrap/respaldos-demo.json
 * para que la semilla del front arranque con respaldos reales y públicos.
 *
 * Requiere .env.local con STELLAR_SECRET_KEY (cuenta ya fondeada por Friendbot).
 * Es idempotente: si una atención ya está anclada con el mismo sello, no
 * vuelve a enviarla.
 *
 * Uso: node scripts/sellar-semilla.mjs
 */

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RUTA_RESPALDOS = resolve(process.cwd(), "src/bootstrap/respaldos-demo.json");

function leerEnv() {
  const ruta = resolve(process.cwd(), ".env.local");
  if (!existsSync(ruta)) throw new Error("Falta .env.local (ejecuta antes scripts/generar-cuenta.mjs).");
  const vars = {};
  for (const linea of readFileSync(ruta, "utf8").split(/\r?\n/)) {
    const pareja = linea.match(/^([A-Z_]+)=(.*)$/);
    if (pareja) vars[pareja[1]] = pareja[2];
  }
  if (!vars.STELLAR_SECRET_KEY) throw new Error(".env.local no define STELLAR_SECRET_KEY.");
  return vars;
}

// --- Sello idéntico al del front: mantener sincronizado con -------------
// --- shared/lib/serialize.ts y features/atenciones/domain/atencion.ts ----
function serializar(valor) {
  if (valor === undefined) return "null";
  if (valor === null || typeof valor !== "object") return JSON.stringify(valor) ?? "null";
  if (Array.isArray(valor)) return `[${valor.map(serializar).join(",")}]`;
  const entradas = Object.entries(valor)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entradas.map(([k, v]) => `${JSON.stringify(k)}:${serializar(v)}`).join(",")}}`;
}

function selloDePlantilla(plantilla) {
  const contenido = {
    pacienteId: plantilla.pacienteId,
    fecha: plantilla.fecha,
    medico: plantilla.medico,
    motivo: plantilla.motivo,
    diagnostico: plantilla.diagnostico,
    tratamiento: plantilla.tratamiento,
    notas: plantilla.notas,
  };
  return createHash("sha256").update(serializar(contenido)).digest("hex");
}

const env = leerEnv();
const institucional = Keypair.fromSecret(env.STELLAR_SECRET_KEY);
const horizon = new Horizon.Server(HORIZON_URL);
const respaldos = existsSync(RUTA_RESPALDOS)
  ? JSON.parse(readFileSync(RUTA_RESPALDOS, "utf8"))
  : {};

const cuenta = await horizon.loadAccount(institucional.publicKey());
const yaAnclados = cuenta.data_attr ?? {};
let enviadas = 0;

for (const plantilla of PLANTILLAS_ATENCIONES_DEMO) {
  const clave = `dc-${plantilla.id}`;
  const sello = selloDePlantilla(plantilla);
  const existente = yaAnclados[clave]
    ? Buffer.from(yaAnclados[clave], "base64").toString("hex")
    : null;

  if (existente === sello && respaldos[plantilla.id]) {
    console.log(`${clave}: ya estaba anclado con el mismo sello (tx ${respaldos[plantilla.id]}).`);
    continue;
  }

  const origen = await horizon.loadAccount(institucional.publicKey());
  const tx = new TransactionBuilder(origen, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.manageData({ name: clave, value: Buffer.from(sello, "hex") }))
    .setTimeout(30)
    .build();
  tx.sign(institucional);
  const respuesta = await horizon.submitTransaction(tx);
  respaldos[plantilla.id] = respuesta.hash;
  enviadas += 1;
  console.log(`${clave} anclado en tx ${respuesta.hash}`);
}

writeFileSync(RUTA_RESPALDOS, `${JSON.stringify(respaldos, null, 2)}\n`);
console.log("");
console.log(`Listo: ${enviadas} transacciones nuevas, ${PLANTILLAS_ATENCIONES_DEMO.length} atenciones demo con respaldo.`);
console.log(`Cuenta institucional : https://stellar.expert/explorer/testnet/account/${institucional.publicKey()}`);
for (const [id, hash] of Object.entries(respaldos)) {
  console.log(`  dc-${id}: https://stellar.expert/explorer/testnet/tx/${hash}`);
}
