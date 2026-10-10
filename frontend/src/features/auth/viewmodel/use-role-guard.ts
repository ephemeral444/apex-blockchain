"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Rol } from "../domain/usuario";
import { RUTA_INICIAL_POR_ROL } from "../domain/usuario";
import { useSesion } from "./session-context";

/**
 * Guarda de acceso por rol: redirige a /login si no hay sesión y al panel
 * del rol cuando el usuario entra a una pantalla que no le corresponde.
 * Devuelve `autorizado` para que la página no renderice nada mientras redirige.
 */
export function useGuardiaRol(rolesPermitidos: Rol[]) {
  const { usuario, listo } = useSesion();
  const router = useRouter();

  const autorizado = Boolean(listo && usuario && rolesPermitidos.includes(usuario.rol));

  useEffect(() => {
    if (!listo) return;
    if (!usuario) {
      router.replace("/login");
      return;
    }
    if (!rolesPermitidos.includes(usuario.rol)) {
      router.replace(RUTA_INICIAL_POR_ROL[usuario.rol]);
    }
  }, [listo, usuario, rolesPermitidos, router]);

  return { usuario, listo, autorizado };
}
