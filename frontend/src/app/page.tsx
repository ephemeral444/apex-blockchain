"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RUTA_INICIAL_POR_ROL } from "@/features/auth/domain/usuario";
import { useSesion } from "@/features/auth/viewmodel/session-context";

/** Punto de entrada: envía al panel del rol activo o al login. */
export default function Inicio() {
  const { usuario, listo } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!listo) return;
    router.replace(usuario ? RUTA_INICIAL_POR_ROL[usuario.rol] : "/login");
  }, [listo, usuario, router]);

  return null;
}
