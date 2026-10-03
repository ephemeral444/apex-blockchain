# Problem Brief - Entregable 1
# Data Concierge: Gobernanza de Historias Clínicas y Evidencia Blockchain
## Decisión del problema

### Problema elegido
* **Enunciado:** La dependencia exclusiva de la infraestructura centralizada institucional para garantizar la integridad, auditoría y evidencia del ciclo de vida de historias clínicas digitales.
* **Propuesto por:** Cristian Díaz

### Por qué elegimos este
El equipo eligió este problema de forma unánime porque representa el núcleo de nuestro proyecto de grado y aporta directamente a nuestro perfil en ingeniería y sistemas de información.  El caso satisface con rigor los criterios de pertinencia de la Sesión 1:
1. **Partes que no confían ciegamente en un único administrador:** Auditores, pacientes y entidades de control necesitan contrastar la información clínica sin depender de la buena fe del administrador de la base de datos institucional.
2. **Histórico inalterable:** Los eventos clínicos requieren una pista de evidencia inmutable e indeleble que impida modificaciones retrospectivas o manipulación de registros ante auditorías o litigios.


### Propuestas descartadas
* **Propuesta 1 (Logística – Trazabilidad de mercancías):** Propuesta por Integrante 1.  
  * *Motivo de descarte:* Aunque aborda disputas y pérdida de carga entre transportistas y brokers, el flujo operativo a menudo se resuelve mediante integraciones EDI y APIs tradicionales con bases de datos relacionales sin requerir estrictamente consenso descentralizado.
* **Propuesta 2 (Automotriz – Trazabilidad de piezas usadas):** Propuesta por Integrante 2.  
  * *Motivo de descarte:* Presenta una brecha crítica en el "oráculo del mundo real", ya que garantizar si un repuesto físico fue o no alterado depende de inspecciones mecánicas manuales que la red descentralizada no puede garantizar por sí misma.
* **Propuesta 3 (Agro – Producción de aguacate verificable):** Propuesta por Integrante 3.  
  * *Motivo de descarte:* Aunque tenía un enfoque comercial estructurado para preventas agrícolas, el equipo consideró que la salud pública posee una criticidad vital mayor, una problemática de integridad más retadora y un impacto directo en el portafolio profesional del equipo hacia el proyecto de grado.

### Cómo tomamos la decisión
La decisión se adoptó tras una sesión de análisis técnico comparativo de las propuestas. El equipo contrastó la viabilidad experimental, la necesidad real de desacoplar la evidencia frente a bases de datos relacionales y el valor formativo. Se determinó por consenso que evolucionar la integridad centralizada hacia un modelo Data Concierge con evidencia externa en blockchain aborda un problema arquitectónico real de alta exigencia académica y profesional.

---

## Problem Brief

### Encabezado
* **Nombre del proyecto:** Data Concierge: Gobernanza de Historias Clínicas y Evidencia Blockchain
* **Descripción del problema:** Vulnerabilidad de los mecanismos centralizados de auditoría e integridad clínica ante la dependencia de un único dominio tecnológico institucional.

### Equipo y roles
* **Integrantes y roles:**
  * Cristian Diaz - Rol: Documentador
  * Julián Galeano - Rol: Investigador
  * Daniel Zapata - Rol: Analista Tecnico
* **Responsable de entregas:** Entre los 3 nos rotamos las entregas
* **Canal de coordinación interna:** Discord / WhatsApp

---

### 1. Problema y evidencia 
En los sistemas hospitalarios de historias clínicas digitales, la información médica evoluciona de manera continua a través de nuevos diagnósticos, tratamientos, observaciones y órdenes terapéuticas. En aplicaciones convencionales carentes de un modelo estricto de versionamiento, las actualizaciones sobrescriben el estado previo, eliminando la capacidad de reconstruir fehacientemente la evolución del paciente. Subsiste una debilidad estructural y es el perímetro tecnológico centralizado.

La evidencia directa de este problema radica en la vulnerabilidad de las pistas de auditoría ante privilegios administrativos elevados en motores de bases de datos relacionales. Un atacante interno o un administrador con credenciales de sistema puede alterar registros clínicos retrospectivamente, recalcular la cadena de hashes locales y regenerar la auditoría sin encender alarmas externas. Adicionalmente, reportes de peritaje médico-legal señalan que, en disputas por mala praxis o fraude clínico, las evidencias provistas por sistemas hospitalarios aislados carecen de fuerza probatoria concluyente al ser generadas, custodiadas y certificadas por la misma parte interesada. A esto se suma que la gobernanza del ciclo de vida del dato suele dispersarse en reglas heterogéneas, dificultando una trazabilidad unificada.

### 2. Usuario y actores 
El problema impacta directamente a tres grupos de interés en el entorno clínico e institucional:
* **Médico:** Es el actor asistencial responsable de registrar consultas, evoluciones y prescripciones. Necesita que el sistema preserve sus notas originales sin riesgo de sobrescritura accidental o adulteración de diagnósticos, garantizando la defensa de su idoneidad profesional.
* **Administrador institucional:** Gestiona el control de acceso basado en roles, las políticas de retención documental y la disponibilidad del servicio. Sufre la dispersión de reglas del ciclo de vida y la carga administrativa de asegurar que el almacenamiento cumpla con las directrices institucionales sin alterar los históricos.
* **Auditor clínico / legal:** Es el principal afectado por la centralización de la evidencia. Debe validar la autenticidad de los registros, investigar incidentes y detectar inconsistencias. Actualmente, el auditor debe confiar en los reportes arrojados por la misma base de datos que está auditando, sin una fuente independiente que certifique que las marcas de tiempo y los hashes no fueron manipulados internamente.

De forma indirecta, el paciente padece las consecuencias cuando decisiones clínicas o reclamaciones jurídicas se fundamentan en registros alterados, ambiguos o cuya cadena de custodia temporal ha sido corrompida.

### 3. Flujo actual de valor 
El flujo actual de gestión y aseguramiento de la información clínica dentro de la institución opera bajo la siguiente secuencia operativa:
1. **Captura asistencial:** El médico ingresa al sistema hospitalario, diligencia la atención en el formulario clínico y confirma la operación.
2. **Generación de versión local:** El backend procesa el payload y genera una nueva versión clínica en la base de datos relacional para evitar la sobrescritura física.
3. **Almacenamiento unificado:** Tanto los datos clínicos sensibles, las versiones, la bitácora de eventos y los hashes quedan alojados en tablas contiguas bajo el control del mismo motor de persistencia.


### 4. Fricciones identificadas 
El análisis del flujo actual revela puntos de fricción críticos asociados al monopolio tecnológico de la confianza:
* **Fricción 1: Auto-certificación y colusión administrativa (Pasos 4 y 6).** Como la auditoría y los hashes conviven en la misma base de datos que los datos clínicos, cualquier actor con privilegios de administrador de base de datos (`DBA`) puede alterar un diagnóstico pasado.
* **Fricción 2: Fragmentación de la gobernanza del ciclo de vida (Pasos 1 y 2).** La lógica de negocio para crear, versionar, consultar, inactivar y alertar sobre expedientes se encuentra dispersa entre módulos de software, dificultando la aplicación determinística de políticas de retención, acceso y calidad del dato.
* **Fricción 3: Fragilidad del sello de tiempo (Paso 3).** La marca temporal de cada evento proviene del reloj del servidor local, el cual puede ser desfasado deliberadamente o por desconfiguración técnica, impidiendo garantizar el momento exacto en que ocurrió una intervención médica.
* **Fricción 4: Falta de medio probatorio externo para el auditor (Paso 5).** El auditor carece de un canal neutro para confrontar los registros institucionales con una verdad inmutable fuera del perímetro de la clínica.

### 5. Oportunidad e hipótesis
**Oportunidad priorizada:** Se prioriza resolver la limitación estructural de la auto-certificación interna y la dispersión en la gobernanza del dato, mediante la implementación de un servicio **Data Concierge** acoplado a un mecanismo de anclaje de evidencias externas. Se selecciona este punto porque permite centralizar el gobierno del ciclo de vida clínico e introducir un árbitro matemático independiente sin exponer datos confidenciales.

**Hipótesis de valor:** Si se implementa un servicio Data Concierge que centralice y gobierne las operaciones del expediente (versionamiento inmutable, control de acceso, políticas de retención y serialización determinística) y ancle de forma asíncrona evidencias criptográficas (`EventHash`, marca temporal y referencia de bloque) en una red blockchain externa, entonces se fortalecerá la gobernanza, trazabilidad y verificabilidad de la información clínica, garantizando que cualquier manipulación en la persistencia local sea detectada de inmediato mediante contraste matemático independiente.

Para el médico, esto garantiza que sus notas sean inalterables. Para el administrador, unifica la gestión del ciclo de vida en una sola capa de servicio estandarizada. Para el auditor, transforma radicalmente su función: deja de creer pasivamente en los reportes de la base de datos institucional y pasa a contrastar las trazas locales contra un libro mayor descentralizado que la organización no puede reescribir.

### 6. Criterio de pertinencia 
La incorporación de blockchain en este proyecto responde rigurosamente a una necesidad arquitectónica que ninguna base de datos tradicional, integración por APIs o esquema centralizado puede suplir, sustentada en los criterios de la Sesión 1:
1. **Desacoplamiento de la confianza frente al custodio tecnológico:** En un sistema puramente relacional o centralizado, el custodio de los datos es juez y parte de la evidencia. Blockchain ofrece un registro público o permisionado operado por nodos independientes donde la clínica no tiene la potestad unilateral de reescribir la historia. La red distribuida actúa como un notario digital externo.
2. **Histórico e inmutabilidad matemáticamente garantizados:** Mientras que en SQL las tablas de auditoría pueden ser limpiadas con comandos `TRUNCATE` o editadas con `UPDATE` por personal de TI, los bloques confirmados en blockchain son inalterables. Esto provee sellado temporal inmutable a los hashes de los eventos clínicos.
3. **Arquitectura Off-Chain estricta y preservación de privacidad:** La pertinencia se maximiza al entender que blockchain no debe almacenar datos clínicos sensibles, diagnósticos ni identidades (cumpliendo principios de confidencialidad y derecho al olvido). La cadena solo recibe el `EventHash` y metadatos técnicos, convirtiendo a DLT en el ancla externa de auditoría ideal para complementar el gobierno ejercido por el Data Concierge.

### 7. Supuestos y riesgos
Para que el prototipo y la hipótesis de evaluación funcionen, deben cumplirse los siguientes supuestos:
* **Supuesto 1 (Consistencia determinística de payloads):** Se asume que el Data Concierge puede serializar los datos clínicos bajo un estándar canónico estricto (JSON canónico RFC-8785) para que el cómputo de `DataHash` y `EventHash` mediante SHA-512 sea idéntico en cualquier entorno o lenguaje de ejecución.
* **Supuesto 2 (Desacoplamiento operativo frente a latencia externa):** Se asume que la indisponibilidad temporal o la latencia de confirmación en la red blockchain no detendrá el flujo asistencial del médico, gestionándose el anclaje mediante colas asíncronas con consistencia eventual.
* **Supuesto 3 (Delimitación experimental en entorno controlado):** Se asume que la validación en laboratorio con datos simulados y escenarios de manipulación artificial es suficiente para contrastar la efectividad del modelo frente al esquema centralizado previo.

**Riesgos que podrían invalidar la hipótesis:**
* **Riesgo de costo y sobrecarga computacional:** Que la complejidad de gestionar anclajes blockchain genere una latencia inaceptable para consultas masivas o costos de transacción prohibitivos si no se diseñan mecanismos de agregación eficiente.
* **Riesgo de falla en la cola de anclaje:** Que periodos prolongados de caída en el nodo RPC provoquen un desfase crítico entre la base de datos local y la red externa, retrasando las verificaciones de auditoría.
