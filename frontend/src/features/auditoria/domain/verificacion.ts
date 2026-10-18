export type ResultadoExpediente = "INTEGRO" | "ALTERADO";

export type ResultadoAtencion = "INTEGRO" | "ALTERADO" | "PENDIENTE";

export interface VerificacionAtencion {
  atencionId: string;
  fecha: string;
  titulo: string;
  resultado: ResultadoAtencion;
  /** Hash de la transacción de anclaje, para enlazar al explorador público. */
  respaldoId?: string;
}

export interface VerificacionExpediente {
  pacienteId: string;
  fecha: string; // ISO de la verificación
  resultado: ResultadoExpediente;
  resumen: string;
  atenciones: VerificacionAtencion[];
}
