"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Usuario } from "../domain/usuario";
import { asegurarSemilla } from "@/bootstrap/semilla";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";

interface Sesion {
  usuario: Usuario | null;
  /** True cuando ya se restauró la sesión desde el almacenamiento local. */
  listo: boolean;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
}

const SessionContext = createContext<Sesion | null>(null);

export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setUsuario(leer<Usuario | null>(CLAVES.sesion, null));
    setListo(true);
    void asegurarSemilla();
  }, []);

  const iniciarSesion = useCallback((nuevo: Usuario) => {
    guardar(CLAVES.sesion, nuevo);
    setUsuario(nuevo);
  }, []);

  const cerrarSesion = useCallback(() => {
    guardar(CLAVES.sesion, null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, listo, iniciarSesion, cerrarSesion }),
    [usuario, listo, iniciarSesion, cerrarSesion],
  );

  return <SessionContext.Provider value={valor}>{children}</SessionContext.Provider>;
}

export function useSesion(): Sesion {
  const sesion = useContext(SessionContext);
  if (!sesion) throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  return sesion;
}
