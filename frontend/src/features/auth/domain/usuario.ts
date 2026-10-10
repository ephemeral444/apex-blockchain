export type Rol = "ADMIN" | "MEDICO" | "AUDITOR";

export interface Usuario {
  id: string;
  nombre: string;
  cargo: string;
  rol: Rol;
}

export const ETIQUETA_ROL: Record<Rol, string> = {
  ADMIN: "Administración",
  MEDICO: "Personal médico",
  AUDITOR: "Auditoría",
};

export const RUTA_INICIAL_POR_ROL: Record<Rol, string> = {
  ADMIN: "/pacientes",
  MEDICO: "/consulta",
  AUDITOR: "/auditoria",
};

/** Usuarios de demostración del prototipo (uno por rol). */
export const USUARIOS_DEMO: Usuario[] = [
  { id: "u-admin", nombre: "Laura Restrepo", cargo: "Administradora de servicios de salud", rol: "ADMIN" },
  { id: "u-medico", nombre: "Dra. Carolina Gómez", cargo: "Médica general", rol: "MEDICO" },
  { id: "u-auditor", nombre: "Jorge Peña", cargo: "Auditor clínico", rol: "AUDITOR" },
];
