import { calcularSello } from "@/shared/lib/hash";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type { Atencion, AtencionRepository, NuevaAtencionDatos, Sello } from "../domain/atencion";
import { contenidoSellado } from "../domain/atencion";

/**
 * Implementación mock del repositorio de atenciones. El sello se calcula con
 * criptografía real del navegador y queda PENDIENTE hasta que el sellador
 * (data/sellador.ts) confirma el respaldo externo, igual que haría el
 * anclaje asíncrono en Stellar. Semana 4: reemplazar por la versión real.
 */
export class MockAtencionRepository implements AtencionRepository {
  private async todas(): Promise<Atencion[]> {
    return leer<Atencion[]>(CLAVES.atenciones, []);
  }

  async listarTodas(): Promise<Atencion[]> {
    return this.todas();
  }

  async listarPorPaciente(pacienteId: string): Promise<Atencion[]> {
    const atenciones = await this.todas();
    return atenciones
      .filter((atencion) => atencion.pacienteId === pacienteId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async crear(datos: NuevaAtencionDatos): Promise<Atencion> {
    const base = { ...datos, fecha: new Date().toISOString() };
    const sello: Sello = {
      estado: "PENDIENTE",
      hash: await calcularSello(contenidoSellado(base)),
      solicitadoEn: Date.now(),
    };
    const atencion: Atencion = { id: crypto.randomUUID(), ...base, sello };
    guardar(CLAVES.atenciones, [...(await this.todas()), atencion]);
    return atencion;
  }

  async marcarConfirmada(id: string, respaldoId: string, selladoEn: string): Promise<void> {
    const atenciones = await this.todas();
    guardar(
      CLAVES.atenciones,
      atenciones.map((atencion) =>
        atencion.id === id
          ? { ...atencion, sello: { ...atencion.sello, estado: "CONFIRMADO", respaldoId, selladoEn } }
          : atencion,
      ),
    );
  }

  async marcarAlterada(id: string): Promise<void> {
    const atenciones = await this.todas();
    guardar(
      CLAVES.atenciones,
      atenciones.map((atencion) =>
        atencion.id === id ? { ...atencion, sello: { ...atencion.sello, estado: "ALTERADO" } } : atencion,
      ),
    );
  }

  async simularAlteracion(pacienteId: string): Promise<Atencion | null> {
    const atenciones = (await this.todas())
      .filter((atencion) => atencion.pacienteId === pacienteId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    const objetivo = atenciones[atenciones.length - 1];
    if (!objetivo) return null;
    objetivo.diagnostico = `${objetivo.diagnostico} (ajuste administrativo posterior)`;
    guardar(
      CLAVES.atenciones,
      (await this.todas()).map((atencion) => (atencion.id === objetivo.id ? objetivo : atencion)),
    );
    return objetivo;
  }
}

export const repositorioAtenciones: AtencionRepository = new MockAtencionRepository();
