export type EstadoExpediente = "ACTIVO" | "INACTIVO" | "BLOQUEADO";

export interface Paciente {
  id: string;
  nombre: string;
  documento: string;
  fechaNacimiento: string; // yyyy-mm-dd
  estado: EstadoExpediente;
  creadoEn: string; // ISO
  /** Datos de la inactivación justificada (el historial nunca se elimina). */
  inactivadoPor?: string;
  motivoInactivacion?: string;
  inactivadoEn?: string;
  /** Se llena cuando una verificación de integridad detecta alteraciones. */
  bloqueadoEn?: string;
}

export interface NuevoPacienteDatos {
  nombre: string;
  documento: string;
  fechaNacimiento: string;
}

export type ResultadoCreacion =
  | { ok: true; paciente: Paciente }
  | { ok: false; error: "DOCUMENTO_DUPLICADO" };

/**
 * Puerto del dominio: los viewmodels dependen de esta interfaz.
 * La implementación actual es un mock local; en la semana 4 se sustituye
 * por una que hable con el backend real sin cambiar vistas ni viewmodels.
 */
export interface PacienteRepository {
  listar(): Promise<Paciente[]>;
  obtenerPorId(id: string): Promise<Paciente | null>;
  crear(datos: NuevoPacienteDatos): Promise<ResultadoCreacion>;
  /** Inactivación justificada: conserva todo el historial. */
  inactivar(id: string, motivo: string, usuario: string): Promise<void>;
  /** Bloqueo por alerta de integridad: impide nuevas atenciones. */
  bloquear(id: string): Promise<void>;
}
