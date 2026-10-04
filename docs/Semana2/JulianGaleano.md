#PROPUESTA DE CASOS DE USO PARA DATA CONASERGE

| HU | Épica | Rol | Estado Ciclo de Vida | Componente Arquitectónico | Criptografía |
|---|---|---|---|---|---|
| HU-1 | E1: Blockchain | Data Concierge | Cálculo Hash ➔ Pendiente Blockchain | .NET (Application) + SQL Server | EventHash (SHA-256) |
| HU-2 | E1: Blockchain | Sistema | Hash Enviado ➔ Confirmado | .NET (BackgroundService) + Nethereum | bytes32 EVM / TxHash |
| HU-3 | E1: Blockchain | Sistema | Hash Enviado ➔ Fallido | .NET (Outbox Worker / Resiliencia) | Gestión de Reintentos |
| HU-4 | E2: Verificación | Auditor | Confirmado | .NET (IntegrityService) + Solidity | Contraste bytes32 |
| HU-5 | E2: Detección | Auditor | Confirmado ➔ Alerta TAMPERED | .NET + Smart Contract (EVM) | Detección Fraude |
| HU-6 | E3: Trazabilidad | Auditor | Confirmado / Fallido | Angular (Panel Auditor) + .NET | Lectura Bloque / Tx |
| HU-7 | E3: Resiliencia | Sistema | Fallido ➔ Volver a Intentar | .NET (Outbox Worker) + Nethereum | Backoff Exponencial |
