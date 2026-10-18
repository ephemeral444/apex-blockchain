import { toast } from "sonner";
import { claveDeAtencion } from "@/shared/lib/stellar";
import { CLAVES, guardar, leer } from "@/shared/lib/storage";
import type { Atencion } from "../domain/atencion";

/**
 * Servicio en segundo plano que ancla las evidencias en Stellar testnet
 * (patrón Outbox del Blueprint): el registro clínico se guarda de inmediato
 * y el respaldo se confirma pocos segundos después, sin bloquear nunca la
 * operación clínica. La vista solo observa el cambio de estado.
 *
 * La firma la hace el backend (/api/sellar) con la cuenta institucional:
 * aquí solo se envía el sello opaco de 32 bytes, nunca contenido clínico.
 */

const RETRASO_INICIAL_MS = 800;
const REINTENTO_ERROR_MS = 10_000;
const MAX_INTENTOS = 6;

interface Intento {
  enVuelo: boolean;
  hechos: number;
  proximoEn: number;
}

const intentos = new Map<string, Intento>();

export function procesarSelladosPendientes(): void {
  const atenciones = leer<Atencion[]>(CLAVES.atenciones, []);
  const ahora = Date.now();

  for (const atencion of atenciones) {
    if (atencion.sello.estado !== "PENDIENTE") continue;
    if (ahora - atencion.sello.solicitadoEn < RETRASO_INICIAL_MS) continue;

    const intento = intentos.get(atencion.id) ?? { enVuelo: false, hechos: 0, proximoEn: 0 };
    if (intento.enVuelo || ahora < intento.proximoEn) continue;
    if (intento.hechos >= MAX_INTENTOS) continue;

    intento.enVuelo = true;
    intentos.set(atencion.id, intento);
    void anclar(atencion.id, atencion.sello.hash)
      .catch(() => {
        intento.hechos += 1;
        intento.proximoEn = Date.now() + REINTENTO_ERROR_MS;
        if (intento.hechos === MAX_INTENTOS) {
          console.error(`El respaldo de la atención ${atencion.id} agotó sus reintentos.`);
          toast.error("Un respaldo de integridad no pudo confirmarse en la red externa.", {
            description: "Quedará pendiente y se reintentará al recargar la aplicación.",
          });
        }
      })
      .finally(() => {
        intento.enVuelo = false;
      });
  }
}

async function anclar(id: string, hash: string): Promise<void> {
  const respuesta = await fetch("/api/sellar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave: claveDeAtencion(id), hash }),
  });
  if (!respuesta.ok) throw new Error(`Sellado respondió ${respuesta.status}`);
  const datos: { txHash: string; selladoEn: string } = await respuesta.json();

  const atenciones = leer<Atencion[]>(CLAVES.atenciones, []);
  const actual = atenciones.find((atencion) => atencion.id === id);
  if (!actual || actual.sello.estado !== "PENDIENTE") return; // otro intento ya la resolvió
  guardar(
    CLAVES.atenciones,
    atenciones.map((atencion) =>
      atencion.id === id
        ? {
            ...atencion,
            sello: {
              ...atencion.sello,
              estado: "CONFIRMADO" as const,
              respaldoId: datos.txHash,
              selladoEn: datos.selladoEn,
            },
          }
        : atencion,
    ),
  );
}
