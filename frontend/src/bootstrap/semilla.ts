import type { Atencion } from "@/features/atenciones/domain/atencion";
import { contenidoSellado } from "@/features/atenciones/domain/atencion";
import { PACIENTES_DEMO, PLANTILLAS_ATENCIONES_DEMO } from "./datos-demo";
import respaldosDemo from "./respaldos-demo.json";
import { calcularSello, generarIdRespaldo } from "@/shared/lib/hash";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";

const RESPALDOS_DEMO: Record<string, string> = respaldosDemo;

/**
 * Datos de ejemplo para que la demo arranque con expedientes ya sellados.
 * Se ejecuta una sola vez: si ya existen pacientes guardados, no hace nada.
 *
 * Las atenciones demo traen respaldos reales en Stellar testnet: el script
 * scripts/sellar-semilla.mjs las ancló con la cuenta institucional y dejó
 * los hash de transacción en respaldos-demo.json, así que cualquier
 * evaluador puede verificarlas en el explorador público desde el primer
 * arranque.
 */
export async function asegurarSemilla(): Promise<void> {
  if (typeof window === "undefined") return;
  const existentes = leer<unknown[]>(CLAVES.pacientes, []);
  if (existentes.length > 0) return;

  const atenciones: Atencion[] = [];
  for (const plantilla of PLANTILLAS_ATENCIONES_DEMO) {
    const { id, ...contenido } = plantilla;
    atenciones.push({
      id,
      ...contenido,
      sello: {
        estado: "CONFIRMADO",
        hash: await calcularSello(contenidoSellado(contenido)),
        solicitadoEn: Date.parse(plantilla.fecha),
        respaldoId: RESPALDOS_DEMO[id] ?? generarIdRespaldo(),
        selladoEn: plantilla.fecha,
      },
    });
  }

  guardar(CLAVES.pacientes, PACIENTES_DEMO);
  guardar(CLAVES.atenciones, atenciones);
}
