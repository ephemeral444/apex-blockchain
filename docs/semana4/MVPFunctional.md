# Semana 4 — MVP funcional

**Data Concierge** — Historias clínicas protegidas con anclaje público en Stellar.

## Qué se construyó esta semana

Tal como declaramos en el Entregable 3 (Opción B: tecnología del ecosistema, sin contrato propio), el MVP ancla cada atención médica en **Stellar testnet** con la operación nativa **Manage Data**:

- **Back (API propia en Next.js, `frontend/src/app/api`)**: `POST /api/sellar` construye, firma con la cuenta institucional (llave solo en variables de entorno del servidor) y envía la transacción `Manage Data` cuyo valor es el sello SHA-256 de 32 bytes; `GET /api/verificar` lee el sello anclado directamente del ledger vía Horizon. Los envíos se serializan en una fila para no competir por el número de secuencia, con reintento ante `tx_bad_seq`.
- **Front**: el "sellador" simulado fue reemplazado por el real (patrón Outbox: guarda primero, ancla después, con reintentos y toasts de error); el diálogo de respaldo enlaza a la transacción real en el explorador público; la auditoría ejecuta la **verificación dual real**: recalcula el sello local y lo contrasta contra el anclaje público de la red.
- **Datos demo pre-anclados**: el script `frontend/scripts/sellar-semilla.mjs` ancló las 5 atenciones demo, de modo que cualquier evaluador ve transacciones reales desde el primer arranque.

## Evidencias verificables

| Evidencia | Enlace |
|---|---|
| Producto en línea (Vercel) | **[COMPLETAR AL DESPLEGAR: URL pública]** |
| Video pitch + demo (máx. 3 min) | **[COMPLETAR AL SUBIR A YOUTUBE: enlace público]** |
| Cuenta institucional en el explorador | https://stellar.expert/explorer/testnet/account/GDCQCF75CVMA3E3NP4ORXKK3RWYNDPE55AFCL5HWLL2IJC2OQNGWD2LH |
| Tx anclaje atención demo `atn-001` | https://stellar.expert/explorer/testnet/tx/6c318851487cfc01cd12095d7e89cd520a342c090c2197854a1500e0317d9426 |
| Tx anclaje atención demo `atn-002` | https://stellar.expert/explorer/testnet/tx/4bb5308352f4559786210df9f2d155baadfad678f2158b2d348475f2a433049e |
| Tx anclaje atención demo `atn-003` | https://stellar.expert/explorer/testnet/tx/c016968f1461be1594affb59f183aa9f97f0a555c80ccf75ae46a787e9ebb6d6 |
| Tx anclaje atención demo `atn-004` | https://stellar.expert/explorer/testnet/tx/65d957f69cfa303b6874d80ea61872c06a90013a279b5d0c803f19cfe3bbd3c7 |
| Tx anclaje atención demo `atn-005` | https://stellar.expert/explorer/testnet/tx/a0624a25f01630ec577bfaf1695a2248ec8e990591a2ce92d774458c8e49a099 |
| Tx de atención registrada en vivo durante las pruebas | https://stellar.expert/explorer/testnet/tx/2411c79615adbf4ba2bc1ea89b041f05fb103e6d87f784614051b35c77128444 |

En cada transacción se puede abrir la operación `Manage Data` y ver la entrada `dc-<id de atención>` con el sello de 32 bytes. En la app, el auditor tiene el enlace "Anclaje" por atención y el médico ve el identificador de respaldo en el diálogo de cada atención.

## Aprendizajes y ajustes priorizados

Durante las cuatro semanas aprendimos que garantizar la integridad de las historias clínicas no exige almacenar información sensible en blockchain ni desarrollar un contrato inteligente. Para nuestro caso, la operación nativa `Manage Data` de Stellar permite anclar sellos SHA-256 de las atenciones en testnet y contrastarlos posteriormente con el contenido local. También comprobamos la importancia de separar la experiencia de usuario de la infraestructura: la arquitectura por funcionalidades permitió sustituir el sellado simulado de la semana 3 por transacciones reales en la semana 4, manteniendo el flujo de registro y auditoría.

El aprendizaje más importante fue distinguir "usar Stellar" de "programar contratos": para notarizar evidencia no se necesita Soroban ni Rust, y la operación nativa `Manage Data` sobre la cuenta institucional resuelve el caso con menos costo, menos superficie de error y evidencia igual de pública. El segundo aprendizaje fue el valor del diseño previo: como la semana 3 dejó el sellador simulado tras una interfaz idéntica, el reemplazo por el anclaje real no tocó la experiencia de usuario ni las vistas.

El punto técnico más delicado fue la serialización determinista: el sello que calcula el navegador debe ser byte a byte el mismo que quedó anclado, así que fijamos datos demo con identificadores y fechas estables y un script que ancla con la misma lógica (`scripts/sellar-semilla.mjs`), verificable por cualquiera.

Ajustes priorizados por impacto y esfuerzo: primero el anclaje real con reintentos y confirmación en segundos (hecho); segundo, la verificación dual del auditor contra la red y no solo contra el hash local (hecho); tercero, enlaces públicos por atención al explorador (hecho). Queda pendiente para después del cierre: autenticación real por institución, persistencia compartida entre dispositivos y alertas proactivas.

## Riesgos y pendientes

**Cuenta institucional única.** Hoy una sola cuenta Ed25519 ancla todos los sellos y su llave privada vive en la variable de entorno del servidor. Es el mayor punto centralizado del MVP: si se compromete, alguien podría anclar sellos falsos (aunque no alterar los ya existentes). Pendiente: rotación de llaves, firma con quórum multi-firma de Stellar y separación de cuentas por institución.

**Dependencia de infraestructura pública.** Usamos Horizon y Friendbot públicos de testnet, con límites de tasa; una saturación dejaría sellos en estado pendiente (la app reintentará y lo informará). En producción se contrataría un nodo propio o un proveedor con SLA.

**Datos clínicos solo en el navegador.** La persistencia es localStorage: los expedientes demo no se comparten entre dispositivos. Es suficiente para demostrar la verificación, pero el MVP real exige base de datos cifrada con copias de seguridad; la red solo respalda sellos opacos, nunca contenido clínico.

**Superficie de la operación Manage Data.** Re-sellar la misma clave sobrescribiría la entrada; la aplicación nunca lo hace (cada atención tiene clave única por identificador), pero conviene documentarlo y monitorear la cuenta.

**Camino a mainnet.** Faltan cotizar tarifas y reserva de saldo, definir gobernanza de la cuenta institucional y un plan de respuesta ante incidentes. También queda pendiente medir el costo real por atención anclada.

**Privacidad.** Solo viaja a la red un hash de 32 bytes sin información personal o clínica, pero el identificador de atención en la clave es correlacionable; antes de producción debe evaluarse seudonimización.

## Plan de validación con usuarios

**Con quiénes.** Los tres perfiles del Problem Brief: médicos que registran evoluciones, administradores de servicios de salud responsables del expediente y auditores clínicos o legales (el principal afectado por la centralización de la evidencia), en instituciones medianas de Colombia.

**Cómo.** Pruebas guiadas con el producto en línea: cada participante ejecuta tareas reales de su rol (registrar una atención y esperar su respaldo; verificar un expediente íntegro; interpretar la alerta de alteración y el bloqueo). Después, entrevista semi-estructurada sobre confianza, utilidad y fricción. Con administradores, además, revisión del flujo de ciclo de vida de pacientes.

**Hipótesis.** H1: el médico registra atenciones sin fricción percibida (el sello confirma en segundos y nunca bloquea la consulta). H2: el auditor confía más en una evidencia que puede contrastar de forma independiente frente a un expediente solo digital. H3: el administrador valora el bloqueo automático y la trazabilidad como argumento de cumplimiento (Resolución 1995 de 1999).

**Criterios de cumplimiento.** Al menos 80 % de tareas completadas sin ayuda; tiempo de confirmación del sello percibido como aceptable (≤ 8 s en la mayoría de sesiones); al menos 70 % explica correctamente, con sus palabras, qué protege el "sello de integridad" sin explicación técnica previa; dos tercios de auditores declaran mayor confianza que con el expediente tradicional; y señales de disposición a adopción (interés en piloto institucional) en al menos una institución contactada.

## Participación del equipo

| Integrante | Usuario GitHub | Aporte principal esta semana |
|---|---|---|
| Daniel Zapata | DanielZR30 | Back Stellar: API de anclaje y verificación, sellador real, cuenta institucional |
| Cristian Díaz | ephemeral444 | Verificación dual del auditor y evidencias públicas en el explorador |
| Julián Galeano | jugaleano32 | Despliegue en Vercel, documentación de semana 4 y video |

> Cada integrante realiza su propio commit en el repositorio durante la semana como evidencia de participación individual.
