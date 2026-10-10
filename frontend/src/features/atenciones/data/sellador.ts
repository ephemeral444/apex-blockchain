import { generarIdRespaldo } from "@/shared/lib/hash";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type { Atencion } from "../domain/atencion";

export const RETRASO_SELLADO_MS = 3000;

/**
 * Simula el servicio en segundo plano que ancla las evidencias en la red
 * externa (patrón Outbox del Blueprint): los registros se guardan de
 * inmediato y el respaldo se confirma unos segundos después, sin bloquear
 * nunca la operación clínica. La vista solo observa el cambio de estado.
 */
export function procesarSelladosPendientes(): void {
  const atenciones = leer<Atencion[]>(CLAVES.atenciones, []);
  const ahora = Date.now();
  let huboCambios = false;

  for (const atencion of atenciones) {
    if (
      atencion.sello.estado === "PENDIENTE" &&
      ahora - atencion.sello.solicitadoEn >= RETRASO_SELLADO_MS
    ) {
      atencion.sello = {
        ...atencion.sello,
        estado: "CONFIRMADO",
        respaldoId: generarIdRespaldo(),
        selladoEn: new Date().toISOString(),
      };
      huboCambios = true;
    }
  }

  if (huboCambios) guardar(CLAVES.atenciones, atenciones);
}
