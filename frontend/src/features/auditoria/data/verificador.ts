import { calcularSello } from "@/shared/lib/hash";
import { claveDeAtencion } from "@/shared/lib/stellar";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type { AtencionRepository } from "@/features/atenciones/domain/atencion";
import { contenidoSellado } from "@/features/atenciones/domain/atencion";
import type { PacienteRepository } from "@/features/pacientes/domain/paciente";
import type {
  ResultadoExpediente,
  VerificacionAtencion,
  VerificacionExpediente,
} from "../domain/verificacion";

interface DatoAnclado {
  encontrado: boolean;
  hashHex?: string;
}

/**
 * Verificación dual del Blueprint, ahora contra la red:
 * 1. Recalcula el sello del contenido actual y lo compara con el sello
 *    guardado al momento del registro (manipulación local).
 * 2. Para las atenciones confirmadas, contrasta ese sello con la entrada
 *    anclada en Stellar testnet (la copia pública e inmutable).
 * Cualquier diferencia acredita una manipulación posterior; si la red no
 * está alcanzable, la atención queda pendiente en vez de dar por buena una
 * verificación que no se hizo.
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
      if (atencion.sello.estado === "PENDIENTE") {
        detalle.push(this.detalle(atencion, "PENDIENTE"));
        continue;
      }

      const anclado = await this.leerAnclado(atencion.id);
      if (anclado === null) {
        // La red externa no respondió: no se da por buena la verificación.
        detalle.push(this.detalle(atencion, "PENDIENTE"));
        continue;
      }
      if (anclado.hashHex !== atencion.sello.hash) {
        alteradas.push(atencion.id);
        detalle.push(this.detalle(atencion, "ALTERADO"));
        continue;
      }
      detalle.push(this.detalle(atencion, "INTEGRO"));
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

  private async leerAnclado(idAtencion: string): Promise<DatoAnclado | null> {
    try {
      const respuesta = await fetch(`/api/verificar?clave=${encodeURIComponent(claveDeAtencion(idAtencion))}`);
      if (!respuesta.ok) return null;
      return (await respuesta.json()) as DatoAnclado;
    } catch {
      return null;
    }
  }

  private detalle(
    atencion: { id: string; fecha: string; motivo: string; sello: { respaldoId?: string } },
    resultado: VerificacionAtencion["resultado"],
  ) {
    return {
      atencionId: atencion.id,
      fecha: atencion.fecha,
      titulo: atencion.motivo,
      resultado,
      respaldoId: atencion.sello.respaldoId,
    };
  }

  private construirResumen(resultado: ResultadoExpediente, alteradas: number, total: number) {
    if (total === 0) return "El expediente no tiene atenciones registradas para verificar.";
    if (resultado === "ALTERADO") {
      return `Se detectaron ${alteradas} de ${total} atenciones que no coinciden con su sello de integridad. El expediente quedó bloqueado y se emitió una alerta de seguridad.`;
    }
    return `Las ${total} atenciones del expediente coinciden con su sello de integridad, contrastado contra el anclaje público en la red de pruebas de Stellar.`;
  }
}

export function obtenerUltimaVerificacion(
  pacienteId: string,
): VerificacionExpediente | null {
  return leer<Record<string, VerificacionExpediente>>(CLAVES.verificaciones, {})[pacienteId] ?? null;
}
