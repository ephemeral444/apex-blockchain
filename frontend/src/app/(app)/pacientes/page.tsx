"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGuardiaRol } from "@/features/auth/viewmodel/use-role-guard";
import { EstadoExpedienteBadge } from "@/features/pacientes/view/estado-expediente-badge";
import { NuevoPacienteDialog } from "@/features/pacientes/view/nuevo-paciente-dialog";
import { usePacientes } from "@/features/pacientes/viewmodel/use-pacientes";
import { calcularEdad, formatearFechaCorta } from "@/shared/lib/format";

export default function PaginaPacientes() {
  const { autorizado } = useGuardiaRol(["ADMIN"]);
  const { pacientesFiltrados, busqueda, setBusqueda, crear } = usePacientes();
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  if (!autorizado) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el expediente clínico único de cada paciente: registro, consulta e
            inactivación justificada.
          </p>
        </div>
        <Button onClick={() => setDialogoAbierto(true)}>
          <UserPlus className="mr-2 size-4" />
          Nuevo paciente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o documento…"
          className="pl-9"
        />
      </div>

      <Card className="py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Nacimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Expediente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientesFiltrados.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell>
                    <span className="font-medium">{paciente.nombre}</span>
                    <span className="block text-xs text-muted-foreground">
                      {calcularEdad(paciente.fechaNacimiento)} años
                    </span>
                  </TableCell>
                  <TableCell>{paciente.documento}</TableCell>
                  <TableCell>{formatearFechaCorta(paciente.fechaNacimiento)}</TableCell>
                  <TableCell>
                    <EstadoExpedienteBadge estado={paciente.estado} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/pacientes/${paciente.id}`}>Ver expediente</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pacientesFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {busqueda
                      ? "Ningún paciente coincide con la búsqueda."
                      : "Todavía no hay pacientes registrados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NuevoPacienteDialog
        abierto={dialogoAbierto}
        onCerrar={() => setDialogoAbierto(false)}
        onCrear={crear}
      />
    </div>
  );
}
