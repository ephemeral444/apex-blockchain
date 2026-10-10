"use client";

import { BadgeCheck, CircleSlash, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EstadoExpediente } from "../domain/paciente";

const configuracion: Record<EstadoExpediente, { texto: string; clase: string; icono: React.ReactNode }> = {
  ACTIVO: {
    texto: "Activo",
    clase: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icono: <BadgeCheck className="size-3" />,
  },
  INACTIVO: {
    texto: "Inactivo",
    clase: "border-slate-200 bg-slate-100 text-slate-600",
    icono: <CircleSlash className="size-3" />,
  },
  BLOQUEADO: {
    texto: "Bloqueado",
    clase: "border-red-200 bg-red-50 text-red-700",
    icono: <OctagonAlert className="size-3" />,
  },
};

export function EstadoExpedienteBadge({ estado }: { estado: EstadoExpediente }) {
  const config = configuracion[estado];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.clase,
      )}
    >
      {config.icono}
      {config.texto}
    </span>
  );
}
