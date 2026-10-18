import { NextRequest, NextResponse } from "next/server";
import { leerDatoAnclado } from "@/server/stellar/lector";

export const runtime = "nodejs";

const CLAVE_VALIDA = /^dc-[A-Za-z0-9_-]{1,58}$/;

/**
 * Consulta el sello anclado de una atención en la cuenta institucional,
 * directamente del ledger vía Horizon. Es la mitad pública de la
 * verificación dual que ejecuta el auditor.
 */
export async function GET(request: NextRequest) {
  const clave = request.nextUrl.searchParams.get("clave") ?? "";
  if (!CLAVE_VALIDA.test(clave)) {
    return NextResponse.json({ error: "Clave de anclaje inválida." }, { status: 400 });
  }

  try {
    const dato = await leerDatoAnclado(clave);
    return NextResponse.json(dato, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const detalle = error instanceof Error ? error.message : "Error desconocido";
    console.error("Fallo leyendo el dato anclado en Horizon:", detalle);
    return NextResponse.json(
      { error: "No fue posible consultar la red de pruebas.", detalle },
      { status: 502 },
    );
  }
}
