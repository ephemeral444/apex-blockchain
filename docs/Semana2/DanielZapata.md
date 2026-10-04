| ID | Título | Como... | Quiero... | Para... | Criterios de Aceptación (Gherkin) | Reglas de Negocio / Restricciones |
|---|---|---|---|---|---|---|
| HU-01 | Crear expediente clínico | Médico | Crear un expediente clínico | Iniciar formalmente el ciclo de vida de la información clínica de un paciente | • Given un usuario autenticado con ROLE_MEDICO y un paciente registrado sin expediente activo
When solicita crear el expediente
Then el sistema genera un MedicalRecordId único, establece Status=ACTIVE y registra el evento de auditoría con Outcome=SUCCESS.

• Given que el paciente ya tiene un expediente ACTIVE
When intenta crear otro
Then el sistema rechaza la operación con HTTP 409 y registra auditoría FAIL. | Solo puede existir un expediente activo por paciente. |
| HU-02 | Consultar versión vigente | Médico o Auditor | Consultar la versión vigente del expediente | Acceder al estado clínico actual autorizado | • Given un expediente con versiones 1 \dots N
When un usuario autorizado consulta la versión vigente
Then retorna la versión con VersionNumber=N y registra auditoría SUCCESS.

• Given un usuario sin permisos
When solicita la versión vigente
Then responde HTTP 403 y registra auditoría FAIL. | Vigente = mayor VersionNumber. El Data Concierge controla el acceso. |
| HU-03 | Registrar nueva versión clínica | Médico | Registrar una modificación clínica como una nueva versión | Conservar íntegramente los estados anteriores del expediente | • Given un expediente ACTIVE cuya última versión es n
When el médico registra una actualización válida
Then el sistema crea la versión n+1, conserva la versión n sin modificación, genera DataHash, establece PreviousEventHash con el EventHash de la versión anterior, genera un nuevo EventHash y registra auditoría SUCCESS. | Las versiones son inmutables desde la aplicación. No existe UPDATE destructivo de versiones históricas. |
| HU-04 | Generar payload canónico determinístico | Sistema | Canonicalizar los datos utilizados en el cálculo criptográfico | Garantizar que el mismo estado produzca siempre la misma huella digital | • Given dos representaciones lógicamente equivalentes de los mismos datos clínicos
When el HashCanonicalizer genera el payload canónico
Then ambas producen exactamente la misma secuencia de bytes y generan el mismo DataHash SHA-512.

• Given una modificación en cualquiera de los campos incluidos
When se recalcula el hash
Then el nuevo DataHash es diferente. | Definir formalmente campos, orden, tipos, representación de null, UTF-8, fechas ISO-8601 UTC y normalización de cadenas. |
| HU-05 | Controlar concurrencia de versiones | Sistema | Controlar actualizaciones concurrentes | Evitar versiones duplicadas o bifurcaciones de la cadena de integridad | • Given que la última versión existente es n y llegan dos solicitudes concurrentes basadas en esa versión
When ambas intentan crear n+1
Then solamente una es confirmada, la segunda recibe HTTP 409 y no se genera una bifurcación de la cadena. | Usar control optimista, restricción única o mecanismo transaccional equivalente. |
| HU-06 | Consultar historial clínico versionado | Médico o Auditor | Consultar el historial de versiones | Reconstruir la evolución temporal del expediente | • Given un expediente con versiones 1 \dots N
When un usuario autorizado consulta el historial
Then el sistema retorna las N versiones ordenadas ascendentemente por VersionNumber, incluye metadatos de creación y estado de integridad permitidos para su rol, y registra auditoría SUCCESS. | No modificar ni reconstruir retrospectivamente versiones. |
| HU-07 | Consultar auditoría | Auditor o Administrador | Consultar los eventos de auditoría | Conocer las operaciones realizadas sobre la información clínica | • Given un usuario con ROLE_AUDITOR o rol autorizado
When consulta la auditoría
Then obtiene eventos con Timestamp, UserId, Action, ResourceId y Outcome.

• Given un usuario sin autorización
When intenta consultar auditoría
Then recibe HTTP 403 y el intento también queda auditado. | Registrar operaciones exitosas y fallidas. Auditoría independiente del historial clínico. |
