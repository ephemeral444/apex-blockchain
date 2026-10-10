"use client";

import { useGuardiaRol } from "@/features/auth/viewmodel/use-role-guard";
import { DemoAlteracionCard } from "@/features/auditoria/view/demo-alteracion-card";
import { EstadoExpedientes } from "@/features/auditoria/view/estado-expedientes";
import { ResultadoVerificacion } from "@/features/auditoria/view/resultado-verificacion";
import { VerificacionPanel } from "@/features/auditoria/view/verificacion-panel";
import { useAuditoria } from "@/features/auditoria/viewmodel/use-auditoria";

export default function PaginaAuditoria() {
  const { autorizado } = useGuardiaRol(["AUDITOR"]);
  const {
    pacientes,
    conteoAtenciones,
    verificacion,
    verificando,
    verificarExpediente,
    simularAlteracion,
    ultimaVerificacionPorPaciente,
  } = useAuditoria();

  if (!autorizado) return null;

  const nombreVerificado = verificacion
    ? (pacientes.find((p) => p.id === verificacion.pacienteId)?.nombre ?? "Paciente")
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Verificación de integridad</h1>
        <p className="text-sm text-muted-foreground">
          Comprueba de forma independiente que las historias clínicas no fueron modificadas
          después de su registro.
        </p>
      </div>

      <VerificacionPanel pacientes={pacientes} verificando={verificando} onVerificar={verificarExpediente} />

      {verificacion && nombreVerificado && (
        <ResultadoVerificacion verificacion={verificacion} nombrePaciente={nombreVerificado} />
      )}

      <EstadoExpedientes
        pacientes={pacientes}
        conteoAtenciones={conteoAtenciones}
        ultimasVerificaciones={ultimaVerificacionPorPaciente}
      />

      <DemoAlteracionCard pacientes={pacientes} onSimular={simularAlteracion} />
    </div>
  );
}
