import { Keypair } from "@stellar/stellar-sdk";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Genera el par de llaves de la cuenta institucional de Stellar testnet y
 * deja las variables de entorno listas en .env.local (no sobrescribe el
 * archivo si ya existe una cuenta). La llave pública también queda como
 * NEXT_PUBLIC_ para que el front pueda enlazar al explorador.
 */
const ENV_PATH = resolve(process.cwd(), ".env.local");

if (existsSync(ENV_PATH)) {
  const actual = readFileSync(ENV_PATH, "utf8");
  if (actual.includes("STELLAR_SECRET_KEY=")) {
    console.log(".env.local ya tiene cuenta institucional; no se generó otra.");
    process.exit(0);
  }
}

const par = Keypair.random();
const contenido = [
  "# Cuenta institucional de Data Concierge en Stellar testnet (fondear con Friendbot)",
  `STELLAR_SECRET_KEY=${par.secret()}`,
  `STELLAR_PUBLIC_KEY=${par.publicKey()}`,
  `NEXT_PUBLIC_STELLAR_ACCOUNT=${par.publicKey()}`,
  `HORIZON_URL=https://horizon-testnet.stellar.org`,
  "",
].join("\n");

writeFileSync(ENV_PATH, contenido, { flag: "wx" });
console.log("Cuenta institucional generada y guardada en .env.local");
console.log("Llave pública :", par.publicKey());
console.log(`Fondear en    : https://friendbot.stellar.org/?addr=${par.publicKey()}`);
