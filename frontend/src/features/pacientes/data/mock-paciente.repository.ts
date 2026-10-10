import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type {
  NuevoPacienteDatos,
  Paciente,
  PacienteRepository,
  ResultadoCreacion,
} from "../domain/paciente";

/**
 * Implementación mock del repositorio de pacientes sobre almacenamiento
 * local. Semana 4: sustituir por la versión que consume el backend real
 * manteniendo la interfaz de `domain/paciente.ts`.
 */
export class MockPacienteRepository implements PacienteRepository {
  async listar(): Promise<Paciente[]> {
    return leer<Paciente[]>(CLAVES.pacientes, []);
  }

  async obtenerPorId(id: string): Promise<Paciente | null> {
    const pacientes = await this.listar();
    return pacientes.find((paciente) => paciente.id === id) ?? null;
  }

  async crear(datos: NuevoPacienteDatos): Promise<ResultadoCreacion> {
    const pacientes = await this.listar();
    const documento = datos.documento.trim();
    if (pacientes.some((paciente) => paciente.documento === documento)) {
      return { ok: false, error: "DOCUMENTO_DUPLICADO" };
    }
    const paciente: Paciente = {
      id: crypto.randomUUID(),
      nombre: datos.nombre.trim(),
      documento,
      fechaNacimiento: datos.fechaNacimiento,
      estado: "ACTIVO",
      creadoEn: new Date().toISOString(),
    };
    guardar(CLAVES.pacientes, [...pacientes, paciente]);
    return { ok: true, paciente };
  }

  async inactivar(id: string, motivo: string, usuario: string): Promise<void> {
    const pacientes = await this.listar();
    guardar(
      CLAVES.pacientes,
      pacientes.map((paciente) =>
        paciente.id === id
          ? {
              ...paciente,
              estado: "INACTIVO",
              motivoInactivacion: motivo,
              inactivadoPor: usuario,
              inactivadoEn: new Date().toISOString(),
            }
          : paciente,
      ),
    );
  }

  async bloquear(id: string): Promise<void> {
    const pacientes = await this.listar();
    guardar(
      CLAVES.pacientes,
      pacientes.map((paciente) =>
        paciente.id === id && paciente.estado === "ACTIVO"
          ? { ...paciente, estado: "BLOQUEADO", bloqueadoEn: new Date().toISOString() }
          : paciente,
      ),
    );
  }
}

export const repositorioPacientes: PacienteRepository = new MockPacienteRepository();
