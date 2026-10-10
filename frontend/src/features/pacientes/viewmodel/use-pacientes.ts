"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { NuevoPacienteDatos, Paciente, PacienteRepository } from "../domain/paciente";
import { repositorioPacientes } from "../data/mock-paciente.repository";
import { suscribirCambios } from "@/shared/lib/storage";

export function usePacientes(repo: PacienteRepository = repositorioPacientes) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const refrescar = useCallback(() => {
    void repo.listar().then(setPacientes);
  }, [repo]);

  useEffect(() => {
    refrescar();
    return suscribirCambios(refrescar);
  }, [refrescar]);

  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return pacientes;
    return pacientes.filter(
      (paciente) =>
        paciente.nombre.toLowerCase().includes(termino) || paciente.documento.includes(termino),
    );
  }, [pacientes, busqueda]);

  const crear = useCallback(
    async (datos: NuevoPacienteDatos): Promise<boolean> => {
      const resultado = await repo.crear(datos);
      if (!resultado.ok) {
        toast.error("Ya existe un paciente con ese número de documento.");
        return false;
      }
      toast.success(`Paciente registrado. Expediente de ${resultado.paciente.nombre} activado.`);
      return true;
    },
    [repo],
  );

  return { pacientes, pacientesFiltrados, busqueda, setBusqueda, crear };
}
