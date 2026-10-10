export type EstadoSellado = "PENDIENTE" | "CONFIRMADO" | "ALTERADO";

export interface Sello {
  estado: EstadoSellado;
  /** Huella criptográfica calculada al momento del registro. */
  hash: string;
  solicitadoEn: number; // epoch ms, para que el sellador simulado no dependa de la vista
  /** Identificador del respaldo externo, presente al confirmarse. */
  respaldoId?: string;
  selladoEn?: string; // ISO
}

export interface Atencion {
  id: string;
  pacienteId: string;
  fecha: string; // ISO del momento de la atención
  medico: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  sello: Sello;
}

export interface NuevaAtencionDatos {
  pacienteId: string;
  medico: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}

/**
 * Campos que cubre el sello de integridad. Cualquier cambio posterior
 * en alguno de ellos hace que la huella recalculada no coincida.
 */
export function contenidoSellado(atencion: {
  pacienteId: string;
  fecha: string;
  medico: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}): Record<string, string> {
  return {
    pacienteId: atencion.pacienteId,
    fecha: atencion.fecha,
    medico: atencion.medico,
    motivo: atencion.motivo,
    diagnostico: atencion.diagnostico,
    tratamiento: atencion.tratamiento,
    notas: atencion.notas,
  };
}

/**
 * Puerto del dominio de atenciones. El mock actual persiste en el
 * navegador; la versión de la semana 4 anclará el sello en Stellar testnet.
 */
export interface AtencionRepository {
  listarTodas(): Promise<Atencion[]>;
  listarPorPaciente(pacienteId: string): Promise<Atencion[]>;
  crear(datos: NuevaAtencionDatos): Promise<Atencion>;
  marcarConfirmada(id: string, respaldoId: string, selladoEn: string): Promise<void>;
  marcarAlterada(id: string): Promise<void>;
  /**
   * Solo para demostración: altera el contenido de la última atención de un
   * expediente sin actualizar su sello, como lo haría un atacante interno
   * sobre la base de datos local.
   */
  simularAlteracion(pacienteId: string): Promise<Atencion | null>;
}
