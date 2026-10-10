export type ResultadoExpediente = "INTEGRO" | "ALTERADO";

export type ResultadoAtencion = "INTEGRO" | "ALTERADO" | "PENDIENTE";

export interface VerificacionAtencion {
  atencionId: string;
  fecha: string;
  titulo: string;
  resultado: ResultadoAtencion;
}

export interface VerificacionExpediente {
  pacienteId: string;
  fecha: string; // ISO de la verificación
  resultado: ResultadoExpediente;
  resumen: string;
  atenciones: VerificacionAtencion[];
}
