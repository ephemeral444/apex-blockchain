"use client";

import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sello } from "../domain/atencion";

interface SelladoBadgeProps {
  sello: Sello;
  onVerRespaldo?: () => void;
  className?: string;
}

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium";

/**
 * El único contacto del usuario con la criptografía: un estado simple y
 * tranquilo para cada registro clínico.
 */
export function SelladoBadge({ sello, onVerRespaldo, className }: SelladoBadgeProps) {
  if (sello.estado === "PENDIENTE") {
    return (
      <span className={cn(base, "border-amber-200 bg-amber-50 text-amber-700", className)}>
        <Loader2 className="size-3 animate-spin" />
        Sellando respaldo…
      </span>
    );
  }

  if (sello.estado === "ALTERADO") {
    return (
      <span className={cn(base, "border-red-200 bg-red-50 text-red-700", className)}>
        <TriangleAlert className="size-3" />
        Sello alterado
      </span>
    );
  }

  const contenido = (
    <>
      <ShieldCheck className="size-3" />
      Respaldo confirmado
    </>
  );
  if (onVerRespaldo) {
    return (
      <button
        type="button"
        onClick={onVerRespaldo}
        title="Ver respaldo de integridad"
        className={cn(
          base,
          "border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100",
          className,
        )}
      >
        {contenido}
      </button>
    );
  }
  return (
    <span className={cn(base, "border-emerald-200 bg-emerald-50 text-emerald-700", className)}>
      {contenido}
    </span>
  );
}
