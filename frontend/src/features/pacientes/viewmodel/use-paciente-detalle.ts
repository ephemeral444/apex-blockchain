"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Atencion } from "@/features/atenciones/domain/atencion";
import { repositorioAtenciones } from "@/features/atenciones/data/mock-atencion.repository";
import type { AtencionRepository } from "@/features/atenciones/domain/atencion";
import type { Paciente, PacienteRepository } from "../domain/paciente";
import { repositorioPacientes } from "../data/mock-paciente.repository";
import { suscribirCambios } from "@/shared/lib/storage";

export function usePacienteDetalle(
  id: string,
  repoPacientes: PacienteRepository = repositorioPacientes,
  repoAtenciones: AtencionRepository = repositorioAtenciones,
) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);

  const refrescar = useCallback(() => {
    void repoPacientes.obtenerPorId(id).then(setPaciente);
    void repoAtenciones.listarPorPaciente(id).then(setAtenciones);
  }, [id, repoPacientes, repoAtenciones]);

  useEffect(() => {
    refrescar();
    return suscribirCambios(refrescar);
  }, [refrescar]);

  const inactivar = useCallback(
    async (motivo: string, usuario: string): Promise<void> => {
      await repoPacientes.inactivar(id, motivo, usuario);
      toast.info("Expediente inactivado. El historial clínico se conserva completo.");
    },
    [id, repoPacientes],
  );

  return { paciente, atenciones, inactivar };
}
