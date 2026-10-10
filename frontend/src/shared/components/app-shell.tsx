"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSesion } from "@/features/auth/viewmodel/session-context";
import { ETIQUETA_ROL, type Rol } from "@/features/auth/domain/usuario";
import { procesarSelladosPendientes } from "@/features/atenciones/data/sellador";
import { iniciales } from "@/shared/lib/format";

interface ItemNavegacion {
  href: string;
  etiqueta: string;
  descripcion: string;
  icono: React.ReactNode;
}

const NAVEGACION_POR_ROL: Record<Rol, ItemNavegacion[]> = {
  ADMIN: [
    {
      href: "/pacientes",
      etiqueta: "Pacientes",
      descripcion: "Expedientes y ciclo de vida",
      icono: <Users className="size-4" />,
    },
  ],
  MEDICO: [
    {
      href: "/consulta",
      etiqueta: "Consulta",
      descripcion: "Atender y registrar evolución",
      icono: <Stethoscope className="size-4" />,
    },
  ],
  AUDITOR: [
    {
      href: "/auditoria",
      etiqueta: "Verificación",
      descripcion: "Integridad de expedientes",
      icono: <ShieldCheck className="size-4" />,
    },
  ],
};

/**
 * Contenedor visual de la app: barra lateral por rol y área de contenido.
 * Aquí vive también el sellador simulado (el "servicio en segundo plano"):
 * confirma los respaldos pendientes cada segundo mientras la app está abierta.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { usuario, cerrarSesion } = useSesion();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const intervalo = setInterval(procesarSelladosPendientes, 1000);
    return () => clearInterval(intervalo);
  }, []);

  if (!usuario) return null;

  const items = NAVEGACION_POR_ROL[usuario.rol];

  return (
    <div className="flex min-h-svh">
      <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar">
        <div className="flex items-center gap-3 border-b px-5 py-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="leading-tight font-semibold">Data Concierge</p>
            <p className="text-xs text-muted-foreground">Historias clínicas protegidas</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const activo = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  activo
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <span className="mt-0.5">{item.icono}</span>
                <span>
                  <span className="font-medium">{item.etiqueta}</span>
                  <span
                    className={cn(
                      "block text-xs",
                      activo ? "text-primary-foreground/75" : "text-muted-foreground",
                    )}
                  >
                    {item.descripcion}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {iniciales(usuario.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">{usuario.nombre}</p>
              <p className="text-xs text-muted-foreground">{ETIQUETA_ROL[usuario.rol]}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              cerrarSesion();
              router.replace("/login");
            }}
          >
            <LogOut className="mr-2 size-4" />
            Salir
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
