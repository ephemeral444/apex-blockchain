"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AtencionRepository } from "@/features/atenciones/domain/atencion";
import { repositorioAtenciones } from "@/features/atenciones/data/mock-atencion.repository";
import type { Paciente, PacienteRepository } from "@/features/pacientes/domain/paciente";
import { repositorioPacientes } from "@/features/pacientes/data/mock-paciente.repository";
import { suscribirCambios } from "@/shared/lib/storage";
import type { VerificacionExpediente } from "../domain/verificacion";
import { VerificadorIntegridad, obtenerUltimaVerificacion } from "../data/verificador";

/**
 * ViewModel del auditor: carga los expedientes con su número de atenciones,
 * ejecuta la verificación de integridad y expone la herramienta de demo
 * que simula una manipulación interna de la base de datos.
 */
export function useAuditoria(
  repoPacientes: PacienteRepository = repositorioPacientes,
  repoAtenciones: AtencionRepository = repositorioAtenciones,
) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [conteoAtenciones, setConteoAtenciones] = useState<Record<string, number>>({});
  const [verificacion, setVerificacion] = useState<VerificacionExpediente | null>(null);
  const [verificando, setVerificando] = useState(false);
  const verificador = useMemo(
    () => new VerificadorIntegridad(repoAtenciones, repoPacientes),
    [repoAtenciones, repoPacientes],
  );

  const refrescar = useCallback(() => {
    void repoPacientes.listar().then(setPacientes);
    void repoAtenciones.listarTodas().then((todas) => {
      const conteo: Record<string, number> = {};
      for (const atencion of todas) conteo[atencion.pacienteId] = (conteo[atencion.pacienteId] ?? 0) + 1;
      setConteoAtenciones(conteo);
    });
  }, [repoPacientes, repoAtenciones]);

  useEffect(() => {
    refrescar();
    return suscribirCambios(refrescar);
  }, [refrescar]);

  const verificarExpediente = useCallback(
    async (pacienteId: string, nombrePaciente: string) => {
      setVerificando(true);
      try {
        const resultado = await verificador.verificar(pacienteId);
        setVerificacion(resultado);
        if (resultado.resultado === "ALTERADO") {
          toast.error(`Alerta de seguridad: expediente de ${nombrePaciente} alterado y bloqueado.`);
        } else {
          toast.success(`Expediente de ${nombrePaciente} íntegro.`);
        }
      } finally {
        setVerificando(false);
      }
    },
    [verificador],
  );

  const simularAlteracion = useCallback(
    async (pacienteId: string) => {
      const alterada = await repoAtenciones.simularAlteracion(pacienteId);
      if (!alterada) {
        toast.error("Ese expediente no tiene atenciones para alterar.");
        return;
      }
      toast.warning("Registro modificado directamente en la base de datos local (solo demostración).");
    },
    [repoAtenciones],
  );

  const ultimaVerificacionPorPaciente = useMemo(() => {
    const mapa: Record<string, VerificacionExpediente | null> = {};
    for (const paciente of pacientes) {
      mapa[paciente.id] = verificacion?.pacienteId === paciente.id
        ? verificacion
        : obtenerUltimaVerificacion(paciente.id);
    }
    return mapa;
  }, [pacientes, verificacion]);

  return {
    pacientes,
    conteoAtenciones,
    verificacion,
    verificando,
    verificarExpediente,
    simularAlteracion,
    ultimaVerificacionPorPaciente,
  };
}
