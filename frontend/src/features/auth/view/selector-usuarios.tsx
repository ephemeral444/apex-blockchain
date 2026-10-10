"use client";

import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { iniciales } from "@/shared/lib/format";
import type { Usuario } from "../domain/usuario";
import { ETIQUETA_ROL } from "../domain/usuario";

interface SelectorUsuariosProps {
  usuarios: Usuario[];
  onSeleccionar: (usuario: Usuario) => void;
}

/** Acceso de demostración: un usuario por rol, sin contraseñas. */
export function SelectorUsuarios({ usuarios, onSeleccionar }: SelectorUsuariosProps) {
  return (
    <div className="space-y-3">
      {usuarios.map((usuario) => (
        <Card
          key={usuario.id}
          className="cursor-pointer py-0 transition-colors hover:border-primary/50 hover:bg-accent"
          onClick={() => onSeleccionar(usuario)}
        >
          <CardContent className="flex items-center gap-4 px-5 py-4">
            <Avatar className="size-11">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {iniciales(usuario.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium leading-tight">{usuario.nombre}</p>
              <p className="text-sm text-muted-foreground">{usuario.cargo}</p>
            </div>
            <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {ETIQUETA_ROL[usuario.rol]}
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
