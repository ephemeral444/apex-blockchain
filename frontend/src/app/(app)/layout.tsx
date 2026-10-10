"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/features/auth/viewmodel/session-context";
import { AppShell } from "@/shared/components/app-shell";

/** Layout del área autenticada: sin sesión activa siempre cae al login. */
export default function LayoutAplicacion({ children }: { children: React.ReactNode }) {
  const { usuario, listo } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (listo && !usuario) router.replace("/login");
  }, [listo, usuario, router]);

  if (!usuario) return null;

  return <AppShell>{children}</AppShell>;
}
