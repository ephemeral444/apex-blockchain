"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGuardiaRol } from "@/features/auth/viewmodel/use-role-guard";
import { EstadoExpedienteBadge } from "@/features/pacientes/view/estado-expediente-badge";
import { usePacientes } from "@/features/pacientes/viewmodel/use-pacientes";
import { calcularEdad } from "@/shared/lib/format";
import { cn } from "@/lib/utils";

export default function PaginaConsulta() {
  const router = useRouter();
  const { autorizado } = useGuardiaRol(["MEDICO"]);
  const { pacientes } = usePacientes();
  const [terminoLocal, setTerminoLocal] = useState("");

  const filtrados = useMemo(() => {
    const termino = terminoLocal.trim().toLowerCase();
    if (!termino) return pacientes;
    return pacientes.filter(
      (paciente) =>
        paciente.nombre.toLowerCase().includes(termino) || paciente.documento.includes(termino),
    );
  }, [pacientes, terminoLocal]);

  if (!autorizado) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Consulta</h1>
        <p className="text-sm text-muted-foreground">
          Busca al paciente y abre su expediente para registrar la evolución del día.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={terminoLocal}
          onChange={(e) => setTerminoLocal(e.target.value)}
          placeholder="Buscar por nombre o documento…"
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtrados.map((paciente) => {
          const atendible = paciente.estado === "ACTIVO";
          return (
            <Card
              key={paciente.id}
              className={cn(
                "py-0 transition-colors",
                atendible ? "cursor-pointer hover:border-primary/50 hover:bg-accent" : "opacity-70",
              )}
              onClick={() => atendible && router.push(`/expediente/${paciente.id}`)}
            >
              <CardContent className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-tight">{paciente.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    Doc. {paciente.documento} · {calcularEdad(paciente.fechaNacimiento)} años
                  </p>
                </div>
                <EstadoExpedienteBadge estado={paciente.estado} />
                {atendible && <ChevronRight className="size-4 text-muted-foreground" />}
              </CardContent>
            </Card>
          );
        })}
        {filtrados.length === 0 && (
          <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Ningún paciente coincide con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
