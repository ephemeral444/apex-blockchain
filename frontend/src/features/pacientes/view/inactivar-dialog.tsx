"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InactivarDialogProps {
  abierto: boolean;
  nombrePaciente: string;
  onCerrar: () => void;
  onConfirmar: (motivo: string) => Promise<void>;
}

/**
 * Inactivación justificada del expediente (Resolución 1995 de 1999):
 * se exige un motivo y queda claro que nada se elimina.
 */
export function InactivarDialog({ abierto, nombrePaciente, onCerrar, onConfirmar }: InactivarDialogProps) {
  const [motivo, setMotivo] = useState("");
  const [procesando, setProcesando] = useState(false);

  const valido = motivo.trim().length >= 10;

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!valido || procesando) return;
    setProcesando(true);
    try {
      await onConfirmar(motivo.trim());
      setMotivo("");
      onCerrar();
    } finally {
      setProcesando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(abierto) => !abierto && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="size-5" />
            Inactivar expediente de {nombrePaciente}
          </DialogTitle>
          <DialogDescription>Describe el motivo de la inactivación.</DialogDescription>
        </DialogHeader>
        <form onSubmit={enviar} className="space-y-4">
          <Alert>
            <AlertDescription>
              El expediente dejará de admitir atenciones, pero el historial clínico completo se
              conserva. Ninguna información se elimina.
            </AlertDescription>
          </Alert>
          <div className="grid gap-2">
            <Label htmlFor="motivo">Motivo de la inactivación *</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Registro duplicado del paciente (documento ya existente)"
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={!valido || procesando}>
              Inactivar expediente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
