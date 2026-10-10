"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, OctagonAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AtencionesTimeline } from "@/features/atenciones/view/atenciones-timeline";
import { useGuardiaRol } from "@/features/auth/viewmodel/use-role-guard";
import { EstadoExpedienteBadge } from "@/features/pacientes/view/estado-expediente-badge";
import { InactivarDialog } from "@/features/pacientes/view/inactivar-dialog";
import { usePacienteDetalle } from "@/features/pacientes/viewmodel/use-paciente-detalle";
import { calcularEdad, formatearFechaCorta } from "@/shared/lib/format";

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const { usuario, listo, autorizado } = useGuardiaRol(["ADMIN"]);
  const { paciente, atenciones, inactivar } = usePacienteDetalle(id);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  if (!autorizado) return null;

  if (listo && !paciente) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/pacientes">
            <ArrowLeft className="mr-2 size-4" />
            Volver a pacientes
          </Link>
        </Button>
        <p className="text-muted-foreground">No se encontró ese expediente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/pacientes">
            <ArrowLeft className="mr-2 size-4" />
            Pacientes
          </Link>
        </Button>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{paciente?.nombre}</h1>
          {paciente && <EstadoExpedienteBadge estado={paciente.estado} />}
        </div>
      </div>

      {paciente?.estado === "BLOQUEADO" && (
        <Alert variant="destructive">
          <OctagonAlert className="size-4" />
          <AlertTitle>Expediente bloqueado por alerta de seguridad</AlertTitle>
          <AlertDescription>
            Una verificación de integridad detectó registros que no coinciden con su sello. El
            expediente no admite nuevas atenciones hasta que la auditoría revise el caso.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Datos del paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Documento</span>
                <span className="font-medium">{paciente?.documento}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Nacimiento</span>
                <span className="font-medium">
                  {paciente ? formatearFechaCorta(paciente.fechaNacimiento) : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Edad</span>
                <span className="font-medium">
                  {paciente ? `${calcularEdad(paciente.fechaNacimiento)} años` : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Atenciones</span>
                <span className="font-medium">{atenciones.length}</span>
              </div>
              <Separator />
              {paciente?.estado === "INACTIVO" && paciente.motivoInactivacion ? (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Inactivado por {paciente.inactivadoPor}</p>
                  <p className="italic">“{paciente.motivoInactivacion}”</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={paciente?.estado !== "ACTIVO"}
                  onClick={() => setDialogoAbierto(true)}
                >
                  Inactivar expediente
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Historial de atenciones</h2>
          <AtencionesTimeline atenciones={atenciones} />
        </div>
      </div>

      {paciente && usuario && (
        <InactivarDialog
          abierto={dialogoAbierto}
          nombrePaciente={paciente.nombre}
          onCerrar={() => setDialogoAbierto(false)}
          onConfirmar={async (motivo) => {
            await inactivar(motivo, usuario.nombre);
          }}
        />
      )}
    </div>
  );
}
