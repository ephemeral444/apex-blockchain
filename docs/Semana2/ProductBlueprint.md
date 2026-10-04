Entre las 7 HU de cada uno, decidimos unificarlas para diseñar estas 7 Historias de Usuario finales, que reflejan la visión del producto y los objetivos de negocio, con un enfoque en la experiencia del usuario y la funcionalidad del sistema

## Historias de usuario

| ID    | Historia de usuario                                       | Enunciado ágil                                                                                                                                                                                                                                                                                                      | Justificación funcional                                                                                                                                                          |
| ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HU-01 | Gestión de pacientes y control del expediente             | Como administrador o personal médico, quiero registrar los datos básicos del paciente, abrir su historia clínica y desactivarla de forma justificada cuando sea necesario, para gestionar todo su ciclo de vida en el sistema, garantizando una única historia clínica activa y conservando el historial previo.    | Unifica el ingreso, la apertura y la inactivación justificada de expedientes, conforme a la Resolución 1995 de 1999, evitando duplicados y eliminaciones físicas de información. |
| HU-02 | Registro e inmutabilidad de atenciones médicas            | Como médico o auditor, quiero registrar nuevas atenciones médicas y consultar el historial completo o su versión más reciente, para garantizar que las consultas anteriores permanezcan intactas y mantener un registro ordenado de la evolución del paciente.                                                      | Agrupa la consulta de la versión vigente y la creación de nuevas evoluciones clínicas, evitando sobrescribir la información previa.                                              |
| HU-03 | Control de cambios simultáneos                            | Como sistema, quiero detectar y organizar las solicitudes de actualización simultáneas sobre una misma historia clínica, para evitar registros duplicados e inconsistencias al guardar la información.                                                                                                              | Gestiona la concurrencia cuando varios usuarios o procesos intentan guardar cambios sobre la misma versión, manteniendo la consistencia de los datos.                            |
| HU-04 | Verificación de integridad y alertas de inalterabilidad   | Como auditor, quiero realizar revisiones automáticas del historial clínico para detectar modificaciones no autorizadas, bloquear nuevas ediciones y recibir alertas de seguridad, para contener posibles alteraciones y proteger la información médica.                                                             | Integra controles de integridad que permiten aislar y bloquear expedientes alterados y notificar al equipo de seguridad.                                                         |
| HU-05 | Control de accesos y permisos por roles                   | Como sistema de control de accesos (Data Concierge), quiero validar el inicio de sesión, verificar los permisos según el rol del usuario (médico, administrador o auditor) y registrar cada intento de consulta o modificación, para garantizar el acceso autorizado y mantener la trazabilidad de las actividades. | Centraliza la autenticación, la autorización basada en roles (RBAC) y el registro de auditoría de accesos.                                                                       |
| HU-06 | Respaldo y notarización en blockchain                     | Como sistema de respaldo (Data Concierge), quiero enviar automáticamente un sello digital de cada atención médica a la red blockchain, sin transmitir datos personales, y reintentar el envío si la red falla, para contar con un respaldo externo e inalterable sin interrumpir la atención hospitalaria.          | Gestiona el envío asíncrono de evidencias digitales sin datos sensibles, evitando que los fallos o retrasos de la red externa bloqueen la atención médica.                       |
| HU-07 | Verificación descentralizada y prevención de alteraciones | Como auditor, quiero comparar los registros médicos locales con las evidencias almacenadas en blockchain y visualizar la trayectoria de la historia clínica, para verificar de forma independiente que la información no haya sido manipulada.                                                                      | Permite contrastar los registros locales con las huellas digitales almacenadas en blockchain para detectar posibles manipulaciones de la base de datos interna.                  |

---

### **1. Propuesta de Valor**

La plataforma **Data Concierge con Evidencias en Blockchain** ofrece a las instituciones prestadoras de servicios de salud una infraestructura de gobernanza y protección de datos clínicos de máxima seguridad. Garantiza la integridad, inmutabilidad y la trazabilidad forense de las historias clínicas digitales sin exponer datos sensibles de los pacientes (PHI) en la red pública.

A diferencia de las soluciones tradicionales centralizadas —donde los registros en bases de datos relacionales quedan expuestos a alteraciones o borrados malintencionados por parte de administradores de base de datos (DBA)—, nuestra plataforma implementa una capa inteligente de *Data Concierge*. Este middleware orquesta un encadenamiento criptográfico local mediante payloads canónicos determinísticos (RFC 8785) y algoritmo SHA-512, complementado con un anclaje asíncrono en Blockchain mediante el patrón *Outbox*.

Los profesionales de la salud obtienen una herramienta ágil que opera sin latencia durante la atención médica. Por su parte, los auditores e inspectores institucionales cuentan con una prueba de existencia descentralizada e inalterable, capaz de detectar automáticamente cualquier discrepancia o reconstrucción fraudulenta en la base de datos local. Esta solución resuelve el dilema entre el estricto cumplimiento normativo (protección de datos personales como la Ley 1581) y la necesidad de una verificación transparente, independiente y auditable frente a terceros.

---

### **2. Flujo de Usuario**

El recorrido interactivo de los usuarios en la solución se desarrolla a través de la siguiente secuencia de pasos:

1. **Autenticación e Ingreso al Sistema:** El usuario (Médico, Administrador o Auditor) ingresa a la aplicación web (Angular) e inicia sesión obteniendo un token JWT que certifica su identidad a nivel de sistema.


2. **Selección o Registro de Paciente:** El Administrador crea o consulta los datos demográficos básicos del paciente para habilitar la apertura de su expediente clínico único (`Status=ACTIVE`).


3. **Registro de Atenciones Clínicas:** El Médico registra una nueva evolución clínica. El *Data Concierge* intercepta la solicitud, evalúa los permisos del rol (RBAC), normaliza el payload bajo el estándar RFC 8785 (UTF-8) y calcula la huella criptográfica SHA-512 (`DataHash`).


4. **Persistencia e Inserción Criptográfica Local:** El sistema almacena la nueva versión de forma inmutable, vinculándola con la versión anterior a través del `PreviousEventHash` en SQL Server, finalizando la operación médica de inmediato.


5. **Anclaje Asíncrono en Blockchain:** Un servicio en segundo plano (*BackgroundService/Outbox*) toma el `EventHash` del registro (sin datos sensibles del paciente), empaqueta la transacción Web3 y la envía a la red Blockchain, pasando el estado de `PENDING` a `CONFIRMED` tras recibir el hash de transacción (`TxHash`) y número de bloque.


6. **Verificación e Inspección de Auditoría:** El Auditor accede al panel de control para ejecutar pruebas de integridad local o contrastar el historial clínico contra la evidencia *on-chain* en la Blockchain. En caso de detectar adulteraciones, el sistema bloquea nuevas versiones y emite alertas de seguridad automáticas.



---

### **3. Alcance del MVP**

El alcance del Producto Mínimo Viable (MVP) se enfoca estrictamente en las capacidades funcionales clave que resuelven la problemática central de integridad y trazabilidad en expedientes clínicos:

#### **Funcionalidad Central (Dentro del MVP):**

* **Gestión del Expediente Clínico y Pacientes:** Módulo administrativo para registro demográfico de pacientes y control del ciclo de vida del expediente único (creación e inactivación justificada).


* **Motor de Versionamiento Criptográfico:** Middleware *Data Concierge* con soporte para canonicalización (RFC 8785), generación de huellas digitales SHA-512/SHA-256 y control de concurrencia optimista.


* **Seguridad y Auditoría Básica:** Validación de tokens JWT de sistema, aplicación de políticas de acceso por roles (RBAC) y registro de log de auditoría con la segregación de funciones.


* **Anclaje en Blockchain:** Módulo asíncrono con patrón *Outbox* para el envío de evidencias opacas (`EventHash`) y consulta de confirmaciones *on-chain*.


* **Módulo de Auditoría y Verificación:** Panel básico para que los auditores verifiquen la integridad local y la constancia descentralizada, emitiendo alertas ante discrepancias (`TAMPERED`).



#### **Funcionalidad Deseable (Fuera del MVP):**

* Integración avanzada con sistemas de firma digital cualificada para médicos.
* Tableros analíticos interactivos y métricas de desempeño del nodo blockchain en tiempo real.
* Exportación masiva automatizada de reportes forenses en formato PDF/A firmado.

**Justificación del Recorte:**

Dejar fuera estas capacidades secundarias no compromete el valor entregado, ya que el MVP cubre el pipeline completo de protección criptográfica y verificación descentralizada necesaria para validar la arquitectura propuesta.

## Lean Canvas

https://miro.com/welcomeonboard/a01tN2gveksxa2Zibmh0RUZzUFhBSlJCY1BKZllHcjRrVndmVGZjckNDNFhVVFltaUpQczJVeFVWaVNYNGZVUWM0VW5QbG9peEZaNEY2QW1HUkJqdlo3TXRrdUlQV3A2T0tldFJDbXhzTy95dHNKM0piTEx4cWVlck95RjlFa1pQdGo1ZEV3bUdPQWRZUHQzSGl6V2NBPT0hdjE=?share_link_id=969511276548

| Bloque | Descripción / Contenido |
| :--- | :--- |
| **1. Problema** | • **Riesgo de manipulación interna:** Vulnerabilidad a alteraciones o borrados malintencionados de registros clínicos en bases de datos locales por usuarios con privilegios elevados (DBAs, administradores).<br>• **Desconfianza frente a terceros:** Dificultad para demostrar ante aseguradoras, auditores o jueces que una historia clínica no fue modificada con posterioridad al evento médico.<br>• **Conflicto normativo y privacidad:** Riesgo de sanciones por violar normativas de datos personales (Ley 1581 / GDPR) si se exponen datos sensibles de salud (PHI) en redes públicas o descentralizadas. |
| **2. Segmento de Clientes** | • **Clientes primarios:** Hospitales, clínicas e Instituciones Prestadoras de Servicios de Salud (IPS) de mediana y alta complejidad.<br>• **Usuarios clave:** Médicos y personal asistencial (creadores de registros), Auditores clínicos/forenses (verificadores) y Oficiales de Ciberseguridad/IT (administradores).<br>• **Beneficiarios secundarios:** Entidades reguladoras, aseguradoras y pacientes. |
| **3. Propuesta de Valor Única (UVP)** | **"Gobernanza e integridad inmutable para historias clínicas digitales con verificación en Blockchain, garantizando atenciones locales sin latencia y cero exposición de datos sensibles del paciente."** |
| **4. Solución** | • **Middleware Data Concierge:** Orquestador inteligente que estandariza, valida y calcula huellas criptográficas locales (SHA-512) de las atenciones médicas.<br>• **Anclaje asíncrono (Outbox Pattern):** Registro de evidencias digitales opacas (sin PHI/PII) en Blockchain sin detener la operación del hospital.<br>• **Módulo de verificación dual:** Comparación automatizada entre base de datos local y evidencia en Blockchain para detectar manipulación o fraudes (`TAMPERED`). |
| **5. Canales** | • **Directo:** Venta consultiva B2B dirigida a directores de tecnología (CTO) y de innovación de IPS y hospitales.<br>• **Integradores/Partnerships:** Alianzas con proveedores de sistemas de Historia Clínica Electrónica (EHR) para integrar el *Data Concierge* como módulo de seguridad.<br>• **Redes académicas y eventos:** Presentación en congresos de salud digital y ciberseguridad. |
| **6. Flujos de Ingreso** | • **Licenciamiento por software (SaaS B2B):** Suscripción mensual o anual basada en el volumen de consultas/versiones procesadas.<br>• **Cobro por verificación/notarización:** Tarifa fraccionada por volumen de atenciones ancladas en Blockchain.<br>• **Servicios de implementación:** Honorarios por integración con el EHR existente y configuración de nodos/Smart Contracts. |
| **7. Estructura de Costos** | • **Desarrollo y mantenimiento:** Salarios del equipo de desarrollo (.NET / Angular / Web3) y arquitectos de software.<br>• **Infraestructura Cloud:** Servidores, bases de datos SQL Server y servicios de integración.<br>• **Costos de red Blockchain (Gas Fees):** Tarifas por ejecución de transacciones y despliegue de contratos inteligentes en la red pública o permisionada.<br>• **Cumplimiento y auditoría:** Certificaciones periódicas en seguridad de la información (ISO 27001, privacidad de datos). |
| **8. Métricas Clave** | • **Tiempo de respuesta local:** Latencia en la creación de evoluciones clínicas (debe mantenerse < 200 ms).<br>• **Tasa de éxito de anclaje:** Porcentaje de transacciones confirmadas exitosamente en Blockchain vía Outbox (`CONFIRMED`).<br>• **Detección de incidentes:** Número de discrepancias de integridad detectadas e intercepciones exitosas (`TAMPERED` / alertas).<br>• **Disponibilidad del servicio:** % de *uptime* de la capa Data Concierge (objetivo: 99.9%). |
| **9. Ventaja Diferencial** | **Arquitectura de Resiliencia Dual:** Separación total entre la gestión clínica rápida en base de datos local y la notarización en Blockchain mediante el patrón Outbox. Esto asegura que la indisponibilidad de la red externa o las tarifas de red jamás bloqueen ni ralenticen la atención médica en urgencias o consulta externa. |

