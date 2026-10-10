"use client";

import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
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

interface DemoAlteracionCardProps {
  pacientes: Paciente[];
  onSimular: (pacienteId: string) => void;
}

/**
 * Herramienta exclusiva de demostración: reproduce el escenario del
 * Problem Brief (un interno modifica la base de datos por fuera de la app)
 * para mostrar que la verificación del auditor lo detecta.
 */
export function DemoAlteracionCard({ pacientes, onSimular }: DemoAlteracionCardProps) {
  const [seleccionado, setSeleccionado] = useState("");

  useEffect(() => {
    if (!seleccionado && pacientes.length > 0) setSeleccionado(pacientes[0]!.id);
  }, [pacientes, seleccionado]);

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-muted-foreground">
          <FlaskConical className="size-5" />
          Herramienta de demostración
        </CardTitle>
        <CardDescription>
          Simula que alguien modifica un registro clínico directamente en la base de datos local,
          por fuera de la aplicación. Luego verifica el expediente: el sello dejará de coincidir,
          se emitirá la alerta y el expediente se bloqueará.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="demo-expediente">Expediente a alterar</Label>
          <Select value={seleccionado} onValueChange={setSeleccionado}>
            <SelectTrigger id="demo-expediente" className="w-full">
              <SelectValue placeholder="Selecciona un expediente" />
            </SelectTrigger>
            <SelectContent>
              {pacientes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
          disabled={!seleccionado}
          onClick={() => seleccionado && onSimular(seleccionado)}
        >
          Simular alteración de un registro
        </Button>
      </CardContent>
    </Card>
  );
}
