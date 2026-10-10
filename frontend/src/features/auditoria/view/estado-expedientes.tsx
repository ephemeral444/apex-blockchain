"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoExpedienteBadge } from "@/features/pacientes/view/estado-expediente-badge";
import { formatearFechaCorta } from "@/shared/lib/format";
import type { Paciente } from "@/features/pacientes/domain/paciente";
import type { VerificacionExpediente } from "../domain/verificacion";

interface EstadoExpedientesProps {
  pacientes: Paciente[];
  conteoAtenciones: Record<string, number>;
  ultimasVerificaciones: Record<string, VerificacionExpediente | null>;
}

export function EstadoExpedientes({
  pacientes,
  conteoAtenciones,
  ultimasVerificaciones,
}: EstadoExpedientesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de los expedientes</CardTitle>
        <CardDescription>
          Panorama de los expedientes del prototipo y su última verificación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Atenciones</TableHead>
              <TableHead>Última verificación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pacientes.map((paciente) => {
              const ultima = ultimasVerificaciones[paciente.id];
              return (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium">{paciente.nombre}</TableCell>
                  <TableCell>{paciente.documento}</TableCell>
                  <TableCell>
                    <EstadoExpedienteBadge estado={paciente.estado} />
                  </TableCell>
                  <TableCell className="text-center">
                    {conteoAtenciones[paciente.id] ?? 0}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ultima
                      ? `${ultima.resultado === "INTEGRO" ? "Íntegro" : "Alterado"} · ${formatearFechaCorta(ultima.fecha)}`
                      : "Sin verificar"}
                  </TableCell>
                </TableRow>
              );
            })}
            {pacientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay pacientes registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
