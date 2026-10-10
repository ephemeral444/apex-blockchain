"use client";

import { useState } from "react";
import { Loader2, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AtencionFormProps {
  nombrePaciente: string;
  onGuardar: (datos: {
    motivo: string;
    diagnostico: string;
    tratamiento: string;
    notas: string;
  }) => Promise<void>;
}

const vacio = { motivo: "", diagnostico: "", tratamiento: "", notas: "" };

export function AtencionForm({ nombrePaciente, onGuardar }: AtencionFormProps) {
  const [datos, setDatos] = useState(vacio);
  const [guardando, setGuardando] = useState(false);

  const valido = datos.motivo.trim().length >= 3 && datos.diagnostico.trim().length >= 3;

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!valido || guardando) return;
    setGuardando(true);
    try {
      await onGuardar({
        motivo: datos.motivo.trim(),
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        notas: datos.notas.trim(),
      });
      setDatos(vacio);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldPlus className="size-5 text-primary" />
          Nueva atención · {nombrePaciente}
        </CardTitle>
        <CardDescription>
          Registra la evolución del paciente. Al guardar, la atención queda protegida de inmediato
          y su respaldo externo se confirma en segundos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={enviar} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="motivo">Motivo de la consulta *</Label>
            <Input
              id="motivo"
              value={datos.motivo}
              onChange={(e) => setDatos({ ...datos, motivo: e.target.value })}
              placeholder="Ej. Control de presión arterial"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="diagnostico">Diagnóstico *</Label>
            <Input
              id="diagnostico"
              value={datos.diagnostico}
              onChange={(e) => setDatos({ ...datos, diagnostico: e.target.value })}
              placeholder="Ej. Hipertensión arterial esencial"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tratamiento">Tratamiento</Label>
            <Input
              id="tratamiento"
              value={datos.tratamiento}
              onChange={(e) => setDatos({ ...datos, tratamiento: e.target.value })}
              placeholder="Medicación, órdenes o recomendaciones"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notas">Notas de evolución</Label>
            <Textarea
              id="notas"
              value={datos.notas}
              onChange={(e) => setDatos({ ...datos, notas: e.target.value })}
              placeholder="Observaciones relevantes de la consulta"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Las atenciones anteriores nunca se sobrescriben: cada una queda como versión
              protegida.
            </p>
            <Button type="submit" disabled={!valido || guardando}>
              {guardando && <Loader2 className="mr-2 size-4 animate-spin" />}
              Registrar atención
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
