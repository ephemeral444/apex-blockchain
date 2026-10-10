import type { Atencion } from "@/features/atenciones/domain/atencion";
import { contenidoSellado } from "@/features/atenciones/domain/atencion";
import type { Paciente } from "@/features/pacientes/domain/paciente";
import { calcularSello, generarIdRespaldo } from "@/shared/lib/hash";
import { haceDias } from "@/shared/lib/format";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";

/**
 * Datos de ejemplo para que la demo arranque con expedientes ya sellados.
 * Se ejecuta una sola vez: si ya existen pacientes guardados, no hace nada.
 */
export async function asegurarSemilla(): Promise<void> {
  if (typeof window === "undefined") return;
  const existentes = leer<Paciente[]>(CLAVES.pacientes, []);
  if (existentes.length > 0) return;

  const pacientes: Paciente[] = [
    {
      id: "pac-001",
      nombre: "María Fernanda Torres",
      documento: "1032456789",
      fechaNacimiento: "1978-03-14",
      estado: "ACTIVO",
      creadoEn: haceDias(30),
    },
    {
      id: "pac-002",
      nombre: "Andrés Camilo Ruiz",
      documento: "1020304050",
      fechaNacimiento: "1992-11-02",
      estado: "ACTIVO",
      creadoEn: haceDias(18),
    },
    {
      id: "pac-003",
      nombre: "Luz Elena Gómez",
      documento: "52778899",
      fechaNacimiento: "1951-06-27",
      estado: "ACTIVO",
      creadoEn: haceDias(45),
    },
  ];

  const plantillas = [
    {
      pacienteId: "pac-001",
      dias: 21,
      medico: "Dra. Carolina Gómez",
      motivo: "Control de tensión arterial",
      diagnostico: "Hipertensión arterial esencial, estadio 1, controlada",
      tratamiento: "Continuar Losartán 50 mg cada 12 horas. Restricción de sal.",
      notas: "Presión 128/82. Paciente refiere buena adherencia al tratamiento.",
    },
    {
      pacienteId: "pac-001",
      dias: 6,
      medico: "Dra. Carolina Gómez",
      motivo: "Dolor lumbar de esfuerzo",
      diagnostico: "Lumbalgia mecánica, sin signos de alarma",
      tratamiento: "Diclofenaco tópico cada 8 horas por 5 días. Higiene postural.",
      notas: "Dolor relacionado con carga física laboral. Se solicita radiografía si persiste en 2 semanas.",
    },
    {
      pacienteId: "pac-002",
      dias: 9,
      medico: "Dra. Carolina Gómez",
      motivo: "Dolor epigástrico de 3 días",
      diagnostico: "Gastritis aguda por AINEs",
      tratamiento: "Omeprazol 20 mg antes del desayuno por 14 días. Suspender ibuprofeno.",
      notas: "Paciente automedicado con ibuprofeno por dolor dental. Se educa sobre riesgos.",
    },
    {
      pacienteId: "pac-003",
      dias: 30,
      medico: "Dra. Carolina Gómez",
      motivo: "Control programado de diabetes",
      diagnostico: "Diabetes mellitus tipo 2, en control metabólico aceptable",
      tratamiento: "Continuar Metformina 850 mg cada 8 horas. Glucemias en ayunas 3 veces por semana.",
      notas: "HbA1c 7.1%. Se refuerza plan de alimentación y caminata 30 minutos diarios.",
    },
    {
      pacienteId: "pac-003",
      dias: 3,
      medico: "Dra. Carolina Gómez",
      motivo: "Mareo y revisión de medicación",
      diagnostico: "Hipoglucemias leves vespertinas por ajuste de dosis",
      tratamiento: "Reducir Metformina a 850 mg cada 12 horas. Control en 15 días.",
      notas: "Glucemias de 68 mg/dL en las tardes. Paciente estable, sin pérdida de conocimiento.",
    },
  ];

  const atenciones: Atencion[] = [];
  for (const plantilla of plantillas) {
    const fecha = haceDias(plantilla.dias);
    const base = {
      pacienteId: plantilla.pacienteId,
      fecha,
      medico: plantilla.medico,
      motivo: plantilla.motivo,
      diagnostico: plantilla.diagnostico,
      tratamiento: plantilla.tratamiento,
      notas: plantilla.notas,
    };
    atenciones.push({
      id: crypto.randomUUID(),
      ...base,
      sello: {
        estado: "CONFIRMADO",
        hash: await calcularSello(contenidoSellado(base)),
        solicitadoEn: Date.parse(fecha),
        respaldoId: generarIdRespaldo(),
        selladoEn: fecha,
      },
    });
  }

  guardar(CLAVES.pacientes, pacientes);
  guardar(CLAVES.atenciones, atenciones);
}
