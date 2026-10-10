"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatearFechaLarga } from "@/shared/lib/format";
import type { Atencion } from "../domain/atencion";

interface RespaldoDialogProps {
  atencion: Atencion | null;
  abierto: boolean;
  onCerrar: () => void;
}

/** Detalle del respaldo externo de una atención, en lenguaje de usuario. */
export function RespaldoDialog({ atencion, abierto, onCerrar }: RespaldoDialogProps) {
  return (
    <Dialog open={abierto} onOpenChange={(abierto) => !abierto && onCerrar()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-600" />
            Respaldo de integridad
          </DialogTitle>
          <DialogDescription>
            Detalle del respaldo externo de la atención del{" "}
            {atencion ? formatearFechaLarga(atencion.fecha) : ""}.
          </DialogDescription>
        </DialogHeader>

        {atencion?.sello.estado === "CONFIRMADO" && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-1">
              <span className="font-medium">Confirmado el</span>
              <span className="text-muted-foreground">
                {atencion.sello.selladoEn ? formatearFechaLarga(atencion.sello.selladoEn) : "—"}
              </span>
            </div>
            <div className="grid gap-1">
              <span className="font-medium">Identificador del respaldo</span>
              <code className="block rounded bg-muted px-2 py-1.5 font-mono text-xs break-all">
                {atencion.sello.respaldoId}
              </code>
            </div>
            <div className="grid gap-1">
              <span className="font-medium">Sello criptográfico del contenido</span>
              <code className="block rounded bg-muted px-2 py-1.5 font-mono text-xs break-all">
                {atencion.sello.hash}
              </code>
            </div>
            <p className="text-muted-foreground">
              Cada atención recibe un sello único que se respalda en una red externa e
              independiente: si alguien modifica el registro después, el sello deja de coincidir.
              En el MVP final, este identificador enlaza directamente con la red de pruebas de
              Stellar.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button asChild variant="ghost">
            <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer">
              Explorador de la red externa
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
          <Button onClick={onCerrar}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
