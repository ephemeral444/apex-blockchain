import type { Paciente } from "@/features/pacientes/domain/paciente";

/**
 * Datos de ejemplo de la demo, con identificadores y fechas fijas para que
 * el sello de cada atención sea determinista: así se pueden anclar de una
 * sola vez en la red de pruebas (scripts/sellar-semilla.mjs) y cualquier
 * persona que abra la app por primera vez ve expedientes con respaldos
 * reales y consultables en el explorador público.
 *
 * Sin imports de runtime: este módulo también lo lee el script de sellado
 * fuera de Next.
 */

export interface PlantillaAtencionDemo {
  id: string;
  pacienteId: string;
  fecha: string; // ISO fija
  medico: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}

export const PACIENTES_DEMO: Paciente[] = [
  {
    id: "pac-001",
    nombre: "María Fernanda Torres",
    documento: "1032456789",
    fechaNacimiento: "1978-03-14",
    estado: "ACTIVO",
    creadoEn: "2026-09-17T09:00:00.000Z",
  },
  {
    id: "pac-002",
    nombre: "Andrés Camilo Ruiz",
    documento: "1020304050",
    fechaNacimiento: "1992-11-02",
    estado: "ACTIVO",
    creadoEn: "2026-09-29T11:20:00.000Z",
  },
  {
    id: "pac-003",
    nombre: "Luz Elena Gómez",
    documento: "52778899",
    fechaNacimiento: "1951-06-27",
    estado: "ACTIVO",
    creadoEn: "2026-09-02T14:45:00.000Z",
  },
];

export const PLANTILLAS_ATENCIONES_DEMO: PlantillaAtencionDemo[] = [
  {
    id: "atn-001",
    pacienteId: "pac-001",
    fecha: "2026-09-26T09:15:00.000Z",
    medico: "Dra. Carolina Gómez",
    motivo: "Control de tensión arterial",
    diagnostico: "Hipertensión arterial esencial, estadio 1, controlada",
    tratamiento: "Continuar Losartán 50 mg cada 12 horas. Restricción de sal.",
    notas: "Presión 128/82. Paciente refiere buena adherencia al tratamiento.",
  },
  {
    id: "atn-002",
    pacienteId: "pac-001",
    fecha: "2026-10-11T10:40:00.000Z",
    medico: "Dra. Carolina Gómez",
    motivo: "Dolor lumbar de esfuerzo",
    diagnostico: "Lumbalgia mecánica, sin signos de alarma",
    tratamiento: "Diclofenaco tópico cada 8 horas por 5 días. Higiene postural.",
    notas: "Dolor relacionado con carga física laboral. Se solicita radiografía si persiste en 2 semanas.",
  },
  {
    id: "atn-003",
    pacienteId: "pac-002",
    fecha: "2026-10-08T16:20:00.000Z",
    medico: "Dra. Carolina Gómez",
    motivo: "Dolor epigástrico de 3 días",
    diagnostico: "Gastritis aguda por AINEs",
    tratamiento: "Omeprazol 20 mg antes del desayuno por 14 días. Suspender ibuprofeno.",
    notas: "Paciente automedicado con ibuprofeno por dolor dental. Se educa sobre riesgos.",
  },
  {
    id: "atn-004",
    pacienteId: "pac-003",
    fecha: "2026-09-17T08:05:00.000Z",
    medico: "Dra. Carolina Gómez",
    motivo: "Control programado de diabetes",
    diagnostico: "Diabetes mellitus tipo 2, en control metabólico aceptable",
    tratamiento: "Continuar Metformina 850 mg cada 8 horas. Glucemias en ayunas 3 veces por semana.",
    notas: "HbA1c 7.1%. Se refuerza plan de alimentación y caminata 30 minutos diarios.",
  },
  {
    id: "atn-005",
    pacienteId: "pac-003",
    fecha: "2026-10-14T11:30:00.000Z",
    medico: "Dra. Carolina Gómez",
    motivo: "Mareo y revisión de medicación",
    diagnostico: "Hipoglucemias leves vespertinas por ajuste de dosis",
    tratamiento: "Reducir Metformina a 850 mg cada 12 horas. Control en 15 días.",
    notas: "Glucemias de 68 mg/dL en las tardes. Paciente estable, sin pérdida de conocimiento.",
  },
];
