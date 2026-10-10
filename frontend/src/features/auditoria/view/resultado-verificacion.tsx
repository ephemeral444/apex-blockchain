"use client";

import { CheckCircle2, Clock, ShieldCheck, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearFechaCorta, formatearFechaLarga } from "@/shared/lib/format";
import type { ResultadoAtencion, VerificacionExpediente } from "../domain/verificacion";

function IconoAtencion({ resultado }: { resultado: ResultadoAtencion }) {
  if (resultado === "INTEGRO") return <CheckCircle2 className="size-4 text-emerald-600" />;
  if (resultado === "ALTERADO") return <TriangleAlert className="size-4 text-red-600" />;
  return <Clock className="size-4 text-amber-600" />;
}

const etiquetaAtencion: Record<ResultadoAtencion, string> = {
  INTEGRO: "Coincide con su sello",
  ALTERADO: "No coincide con su sello",
  PENDIENTE: "Respaldo en curso",
};

/** Resultado de la verificación, expresado sin tecnicismos. */
export function ResultadoVerificacion({
  verificacion,
  nombrePaciente,
}: {
  verificacion: VerificacionExpediente;
  nombrePaciente: string;
}) {
  const integro = verificacion.resultado === "INTEGRO";

  return (
    <Card className={integro ? "border-emerald-300" : "border-red-300"}>
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-3">
          {integro ? (
            <ShieldCheck className="size-8 text-emerald-600" />
          ) : (
            <TriangleAlert className="size-8 text-red-600" />
          )}
          <span className={integro ? "text-emerald-800" : "text-red-800"}>
            {integro ? "Expediente íntegro" : "Se detectó una alteración"}
          </span>
        </CardTitle>
        <CardDescription>
          Expediente de {nombrePaciente} · verificado el {formatearFechaLarga(verificacion.fecha)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p
          className={
            integro
              ? "rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
          }
        >
          {verificacion.resumen}
        </p>
        {verificacion.atenciones.length > 0 && (
          <ul className="divide-y">
            {verificacion.atenciones.map((atencion) => (
              <li key={atencion.atencionId} className="flex items-center gap-3 py-2 text-sm">
                <IconoAtencion resultado={atencion.resultado} />
                <span className="flex-1">
                  {atencion.titulo}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatearFechaCorta(atencion.fecha)}
                  </span>
                </span>
                <span
                  className={
                    atencion.resultado === "ALTERADO"
                      ? "text-xs font-medium text-red-700"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {etiquetaAtencion[atencion.resultado]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
