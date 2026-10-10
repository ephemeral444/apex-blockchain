"use client";

import { useEffect, useState } from "react";
import { Loader2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Paciente } from "@/features/pacientes/domain/paciente";

interface VerificacionPanelProps {
  pacientes: Paciente[];
  verificando: boolean;
  onVerificar: (pacienteId: string, nombrePaciente: string) => void;
}

export function VerificacionPanel({ pacientes, verificando, onVerificar }: VerificacionPanelProps) {
  const [seleccionado, setSeleccionado] = useState<string>("");

  useEffect(() => {
    if (!seleccionado && pacientes.length > 0) setSeleccionado(pacientes[0]!.id);
  }, [pacientes, seleccionado]);

  const paciente = pacientes.find((p) => p.id === seleccionado);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="size-5 text-primary" />
          Verificar un expediente
        </CardTitle>
        <CardDescription>
          Contrasta cada atención con su sello de integridad para confirmar que la información no
          fue modificada después del registro.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="expediente">Expediente</Label>
          <Select value={seleccionado} onValueChange={setSeleccionado}>
            <SelectTrigger id="expediente" className="w-full">
              <SelectValue placeholder="Selecciona un expediente" />
            </SelectTrigger>
            <SelectContent>
              {pacientes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre} · Doc. {p.documento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="lg"
          disabled={!paciente || verificando}
          onClick={() => paciente && onVerificar(paciente.id, paciente.nombre)}
        >
          {verificando ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <FileSearch className="mr-2 size-4" />
          )}
          Verificar expediente
        </Button>
      </CardContent>
    </Card>
  );
}
