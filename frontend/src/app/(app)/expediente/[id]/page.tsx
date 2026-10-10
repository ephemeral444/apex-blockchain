"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Info, OctagonAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AtencionForm } from "@/features/atenciones/view/atencion-form";
import { AtencionesTimeline } from "@/features/atenciones/view/atenciones-timeline";
import { useGuardiaRol } from "@/features/auth/viewmodel/use-role-guard";
import { EstadoExpedienteBadge } from "@/features/pacientes/view/estado-expediente-badge";
import { useExpediente } from "@/features/atenciones/viewmodel/use-expediente";
import { calcularEdad } from "@/shared/lib/format";

export default function PaginaExpediente() {
  const { id } = useParams<{ id: string }>();
  const { usuario, listo, autorizado } = useGuardiaRol(["MEDICO", "ADMIN"]);
  const { paciente, atenciones, registrarAtencion } = useExpediente(id);

  if (!autorizado) return null;

  if (listo && !paciente) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={usuario?.rol === "ADMIN" ? "/pacientes" : "/consulta"}>
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Link>
        </Button>
        <p className="text-muted-foreground">No se encontró ese expediente.</p>
      </div>
    );
  }

  const rutaVolver = usuario?.rol === "ADMIN" ? "/pacientes" : "/consulta";
  const medicoPuedeRegistrar = usuario?.rol === "MEDICO" && paciente?.estado === "ACTIVO";

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href={rutaVolver}>
            <ArrowLeft className="mr-2 size-4" />
            {usuario?.rol === "ADMIN" ? "Pacientes" : "Consulta"}
          </Link>
        </Button>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{paciente?.nombre}</h1>
          {paciente && <EstadoExpedienteBadge estado={paciente.estado} />}
          {paciente && (
            <span className="text-sm text-muted-foreground">
              Doc. {paciente.documento} · {calcularEdad(paciente.fechaNacimiento)} años
            </span>
          )}
        </div>
      </div>

      {paciente?.estado === "BLOQUEADO" && (
        <Alert variant="destructive">
          <OctagonAlert className="size-4" />
          <AlertTitle>Expediente bloqueado por alerta de seguridad</AlertTitle>
          <AlertDescription>
            Una verificación de integridad detectó registros que no coinciden con su sello. No es
            posible registrar nuevas atenciones mientras la auditoría revisa el caso.
          </AlertDescription>
        </Alert>
      )}

      {paciente?.estado === "INACTIVO" && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Expediente inactivo</AlertTitle>
          <AlertDescription>
            Este expediente fue inactivado de forma justificada y no admite nuevas atenciones. El
            historial permanece disponible para consulta.
          </AlertDescription>
        </Alert>
      )}

      {medicoPuedeRegistrar && usuario && (
        <AtencionForm
          nombrePaciente={paciente!.nombre}
          onGuardar={(datos) => registrarAtencion(datos, usuario.nombre)}
        />
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Historial de atenciones</h2>
        <AtencionesTimeline atenciones={atenciones} />
      </div>
    </div>
  );
}
