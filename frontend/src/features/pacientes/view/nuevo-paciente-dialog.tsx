"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NuevoPacienteDatos } from "../domain/paciente";

interface NuevoPacienteDialogProps {
  abierto: boolean;
  onCerrar: () => void;
  onCrear: (datos: NuevoPacienteDatos) => Promise<boolean>;
}

const vacio = { nombre: "", documento: "", fechaNacimiento: "" };

export function NuevoPacienteDialog({ abierto, onCerrar, onCrear }: NuevoPacienteDialogProps) {
  const [datos, setDatos] = useState(vacio);
  const [creando, setCreando] = useState(false);

  const valido =
    datos.nombre.trim().length >= 3 &&
    datos.documento.trim().length >= 4 &&
    datos.fechaNacimiento !== "";

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!valido || creando) return;
    setCreando(true);
    try {
      const exitoso = await onCrear(datos);
      if (exitoso) {
        setDatos(vacio);
        onCerrar();
      }
    } finally {
      setCreando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(abierto) => !abierto && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Nuevo paciente
          </DialogTitle>
          <DialogDescription>
            Registra los datos básicos y se abre su expediente clínico único.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={enviar} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              placeholder="Ej. María Fernanda Torres"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="documento">Número de documento *</Label>
            <Input
              id="documento"
              value={datos.documento}
              onChange={(e) => setDatos({ ...datos, documento: e.target.value })}
              placeholder="Ej. 1032456789"
              inputMode="numeric"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaNacimiento">Fecha de nacimiento *</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              value={datos.fechaNacimiento}
              onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!valido || creando}>
              {creando && <Loader2 className="mr-2 size-4 animate-spin" />}
              Registrar paciente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
