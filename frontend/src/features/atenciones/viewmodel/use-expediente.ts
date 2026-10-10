"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Paciente, PacienteRepository } from "@/features/pacientes/domain/paciente";
import { repositorioPacientes } from "@/features/pacientes/data/mock-paciente.repository";
import { suscribirCambios } from "@/shared/lib/storage";
import type { Atencion, AtencionRepository, NuevaAtencionDatos } from "../domain/atencion";
import { repositorioAtenciones } from "../data/mock-atencion.repository";

export function useExpediente(
  pacienteId: string,
  repoPacientes: PacienteRepository = repositorioPacientes,
  repoAtenciones: AtencionRepository = repositorioAtenciones,
) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);

  const refrescar = useCallback(() => {
    void repoPacientes.obtenerPorId(pacienteId).then(setPaciente);
    void repoAtenciones.listarPorPaciente(pacienteId).then(setAtenciones);
  }, [pacienteId, repoPacientes, repoAtenciones]);

  useEffect(() => {
    refrescar();
    return suscribirCambios(refrescar);
  }, [refrescar]);

  // Mientras hay sellos en curso, la vista se refresca sola hasta que todos confirmen.
  const hayPendientes = atenciones.some((atencion) => atencion.sello.estado === "PENDIENTE");
  useEffect(() => {
    if (!hayPendientes) return;
    const intervalo = setInterval(refrescar, 800);
    return () => clearInterval(intervalo);
  }, [hayPendientes, refrescar]);

  const registrarAtencion = useCallback(
    async (
      datos: Omit<NuevaAtencionDatos, "pacienteId" | "medico">,
      medico: string,
    ): Promise<void> => {
      if (!paciente || paciente.estado !== "ACTIVO") {
        toast.error("Este expediente no admite nuevas atenciones.");
        return;
      }
      await repoAtenciones.crear({ ...datos, pacienteId, medico });
      toast.success("Atención registrada. El respaldo de integridad se confirma en segundos.");
      refrescar();
    },
    [paciente, pacienteId, repoAtenciones, refrescar],
  );

  return { paciente, atenciones, registrarAtencion };
}
