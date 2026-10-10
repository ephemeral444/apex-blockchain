"use client";

import { useState } from "react";
import { CalendarDays, Lock, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatearFechaLarga } from "@/shared/lib/format";
import type { Atencion } from "../domain/atencion";
import { RespaldoDialog } from "./respaldo-dialog";
import { SelladoBadge } from "./sellado-badge";

/**
 * Historial del expediente en orden cronológico inverso. Las atenciones
 * previas son de solo lectura: se muestran tal como quedaron registradas.
 */
export function AtencionesTimeline({ atenciones }: { atenciones: Atencion[] }) {
  const [atencionRespaldo, setAtencionRespaldo] = useState<Atencion | null>(null);

  if (atenciones.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
        Aún no hay atenciones registradas en este expediente.
      </div>
    );
  }

  return (
    <>
      <ol className="relative space-y-4 border-l pl-6 ml-2">
        {atenciones.map((atencion) => (
          <li key={atencion.id} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[31px] top-6 size-2.5 rounded-full ring-4 ring-background",
                atencion.sello.estado === "ALTERADO" ? "bg-red-500" : "bg-emerald-500",
              )}
            />
            <Card
              className={cn(
                "gap-3",
                atencion.sello.estado === "ALTERADO" && "border-red-300 bg-red-50/50",
              )}
            >
              <CardHeader className="gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatearFechaLarga(atencion.fecha)}
                  </span>
                  <SelladoBadge
                    sello={atencion.sello}
                    onVerRespaldo={
                      atencion.sello.estado === "CONFIRMADO"
                        ? () => setAtencionRespaldo(atencion)
                        : undefined
                    }
                  />
                </div>
                <CardTitle className="text-base">{atencion.motivo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <p>
                  <span className="font-medium">Diagnóstico:</span> {atencion.diagnostico}
                </p>
                <p>
                  <span className="font-medium">Tratamiento:</span> {atencion.tratamiento || "—"}
                </p>
                {atencion.notas && (
                  <p className="text-muted-foreground italic">{atencion.notas}</p>
                )}
                {atencion.sello.estado === "ALTERADO" && (
                  <p className="flex items-center gap-1.5 font-medium text-red-600">
                    <TriangleAlert className="size-4" />
                    Esta atención no coincide con su sello de integridad.
                  </p>
                )}
                <p className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                  <Lock className="size-3" />
                  Registro protegido · {atencion.medico}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <RespaldoDialog
        atencion={atencionRespaldo}
        abierto={atencionRespaldo !== null}
        onCerrar={() => setAtencionRespaldo(null)}
      />
    </>
  );
}
