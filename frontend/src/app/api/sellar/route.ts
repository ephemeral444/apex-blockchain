import { NextRequest, NextResponse } from "next/server";
import { publicKeyInstitucional } from "@/server/stellar/cliente";
import { sellarDato } from "@/server/stellar/sellador";

export const runtime = "nodejs";

const CLAVE_VALIDA = /^dc-[A-Za-z0-9_-]{1,58}$/;
const HASH_VALIDO = /^[0-9a-f]{64}$/;

/**
 * Ancla el sello de una atención en Stellar testnet (Manage Data) con la
 * firma institucional del servidor. El navegador nunca ve la llave privada.
 */
export async function POST(request: NextRequest) {
  let cuerpo: { clave?: unknown; hash?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido." }, { status: 400 });
  }

  const clave = typeof cuerpo.clave === "string" ? cuerpo.clave : "";
  const hash = typeof cuerpo.hash === "string" ? cuerpo.hash : "";
  if (!CLAVE_VALIDA.test(clave)) {
    return NextResponse.json({ error: "Clave de anclaje inválida." }, { status: 400 });
  }
  if (!HASH_VALIDO.test(hash)) {
    return NextResponse.json({ error: "El sello debe ser un SHA-256 en hex (64 caracteres)." }, { status: 400 });
  }

  try {
    const txHash = await sellarDato(clave, hash);
    return NextResponse.json({
      txHash,
      selladoEn: new Date().toISOString(),
      cuenta: publicKeyInstitucional(),
    });
  } catch (error) {
    const detalle = error instanceof Error ? error.message : "Error desconocido";
    console.error("Fallo anclando sello en Stellar:", detalle);
    return NextResponse.json(
      { error: "No fue posible anclar el sello en la red de pruebas.", detalle },
      { status: 502 },
    );
  }
}
