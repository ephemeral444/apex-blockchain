"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, UserCheck } from "lucide-react";
import { RUTA_INICIAL_POR_ROL, USUARIOS_DEMO } from "@/features/auth/domain/usuario";
import { useSesion } from "@/features/auth/viewmodel/session-context";
import { SelectorUsuarios } from "@/features/auth/view/selector-usuarios";

const puntosClave = [
  {
    icono: <Lock className="size-4" />,
    texto: "Cada atención queda sellada al registrarse y no puede reescribirse.",
  },
  {
    icono: <ShieldCheck className="size-4" />,
    texto: "El sello se respalda en una red externa, independiente de la del hospital.",
  },
  {
    icono: <UserCheck className="size-4" />,
    texto: "Cada perfil (médico, administración, auditoría) ve solo lo que le corresponde.",
  },
];

export default function PaginaLogin() {
  const { usuario, listo, iniciarSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (listo && usuario) router.replace(RUTA_INICIAL_POR_ROL[usuario.rol]);
  }, [listo, usuario, router]);

  return (
    <div className="grid min-h-svh flex-1 md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-b from-teal-800 to-teal-950 p-10 text-teal-50 md:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="size-5" />
          </span>
          <p className="font-semibold">Data Concierge</p>
        </div>

        <div className="space-y-6">
          <h1 className="max-w-sm text-3xl leading-tight font-bold">
            Historias clínicas protegidas de punta a punta
          </h1>
          <ul className="space-y-3">
            {puntosClave.map((punto) => (
              <li key={punto.texto} className="flex items-start gap-3 text-sm text-teal-100">
                <span className="mt-0.5 text-teal-300">{punto.icono}</span>
                {punto.texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-teal-200/80">
          Prototipo funcional · datos simulados · respaldos sobre red de pruebas
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold">Ingresar al sistema</h2>
            <p className="text-sm text-muted-foreground">
              Selecciona un perfil de demostración para recorrer el flujo completo.
            </p>
          </div>
          <SelectorUsuarios
            usuarios={USUARIOS_DEMO}
            onSeleccionar={(usuario) => {
              iniciarSesion(usuario);
              router.replace(RUTA_INICIAL_POR_ROL[usuario.rol]);
            }}
          />
          <p className="text-center text-xs text-muted-foreground">
            Los perfiles son de demostración: no requieren contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}
