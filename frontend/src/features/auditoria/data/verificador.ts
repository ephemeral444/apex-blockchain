import { calcularSello } from "@/shared/lib/hash";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type { AtencionRepository } from "@/features/atenciones/domain/atencion";
import { contenidoSellado } from "@/features/atenciones/domain/atencion";
import type { PacienteRepository } from "@/features/pacientes/domain/paciente";
import type {
  ResultadoExpediente,
  VerificacionAtencion,
  VerificacionExpediente,
} from "../domain/verificacion";

/**
 * Verificación dual del Blueprint: recalcula el sello del contenido actual
 * de cada atención y lo compara con el sello guardado al momento del
 * registro. Cualquier diferencia acredita una manipulación posterior.
 */
export class VerificadorIntegridad {
  constructor(
    private readonly atenciones: AtencionRepository,
    private readonly pacientes: PacienteRepository,
  ) {}

  async verificar(pacienteId: string): Promise<VerificacionExpediente> {
    const atenciones = await this.atenciones.listarPorPaciente(pacienteId);
    const detalle: VerificacionAtencion[] = [];
    const alteradas: string[] = [];

    for (const atencion of atenciones) {
      if (atencion.sello.estado === "ALTERADO") {
        alteradas.push(atencion.id);
        detalle.push(this.detalle(atencion, "ALTERADO"));
        continue;
      }
      const recalculado = await calcularSello(contenidoSellado(atencion));
      if (recalculado !== atencion.sello.hash) {
        alteradas.push(atencion.id);
        detalle.push(this.detalle(atencion, "ALTERADO"));
        continue;
      }
      detalle.push(this.detalle(atencion, atencion.sello.estado === "PENDIENTE" ? "PENDIENTE" : "INTEGRO"));
    }

    if (alteradas.length > 0) {
      for (const id of alteradas) await this.atenciones.marcarAlterada(id);
      await this.pacientes.bloquear(pacienteId);
    }

    const resultado: ResultadoExpediente = alteradas.length > 0 ? "ALTERADO" : "INTEGRO";
    const verificacion: VerificacionExpediente = {
      pacienteId,
      fecha: new Date().toISOString(),
      resultado,
      resumen: this.construirResumen(resultado, alteradas.length, atenciones.length),
      atenciones: detalle,
    };

    const historial = leer<Record<string, VerificacionExpediente>>(CLAVES.verificaciones, {});
    historial[pacienteId] = verificacion;
    guardar(CLAVES.verificaciones, historial);
    return verificacion;
  }

  private detalle(atencion: { id: string; fecha: string; motivo: string }, resultado: VerificacionAtencion["resultado"]) {
    return { atencionId: atencion.id, fecha: atencion.fecha, titulo: atencion.motivo, resultado };
  }

  private construirResumen(resultado: ResultadoExpediente, alteradas: number, total: number): string {
    if (total === 0) return "El expediente no tiene atenciones registradas para verificar.";
    if (resultado === "ALTERADO") {
      return `Se detectaron ${alteradas} de ${total} atenciones que no coinciden con su sello de integridad. El expediente quedó bloqueado y se emitió una alerta de seguridad.`;
    }
    return `Las ${total} atenciones del expediente coinciden con su sello de integridad. No se detectó ninguna manipulación.`;
  }
}

export function obtenerUltimaVerificacion(
  pacienteId: string,
): VerificacionExpediente | null {
  return leer<Record<string, VerificacionExpediente>>(CLAVES.verificaciones, {})[pacienteId] ?? null;
}
