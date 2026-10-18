# Data Concierge — Historias Clínicas Protegidas

MVP funcional (Entregable 4): cada atención médica queda sellada con SHA-256 y anclada
en **Stellar testnet** mediante la operación nativa `Manage Data`, con una cuenta
institucional cuya llave privada vive solo en el servidor. La documentación del
proyecto vive en `docs/` (la de esta semana: `docs/semana4/MVPFunctional.md`).

## Evidencias públicas

- Cuenta institucional en el explorador:
  <https://stellar.expert/explorer/testnet/account/GDCQCF75CVMA3E3NP4ORXKK3RWYNDPE55AFCL5HWLL2IJC2OQNGWD2LH>
- Producto en línea: **[completar al desplegar en Vercel]**
- Video (máx. 3 min): **[completar al subir a YouTube]**

## Requisitos

- Node.js 18.18 o superior (probado con Node 24)
- npm (viene incluido con Node.js)

## Instalación

1. Clona este repositorio.
2. Entra a la carpeta del front:

   ```bash
   cd frontend
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración de la cuenta institucional (testnet)

El anclaje usa una cuenta de Stellar testnet. Para crearla (una sola vez):

```bash
node scripts/generar-cuenta.mjs   # escribe .env.local con las llaves
```

Luego fondea la cuenta con Friendbot abriendo la URL que imprime el script.
`.env.local` queda ignorado por git: la llave privada nunca se sube al repositorio.

## Cómo correrlo

Con las dependencias instaladas y `.env.local` presente, desde `frontend`:

```bash
npm run dev
```

Abre <http://localhost:3000> en el navegador. En la pantalla de ingreso aparecen tres
perfiles de demostración (administración, médico y auditor) que se seleccionan con un
clic, sin contraseña.

> Si ya habías usado el prototipo de la semana 3, limpia el almacenamiento del
> navegador (localStorage) para que se siembre la demo nueva con respaldos reales.

## Cómo se anclan los datos demo

El script `node scripts/sellar-semilla.mjs` ancla las 5 atenciones demo en testnet
(una transacción por atención) y actualiza `src/bootstrap/respaldos-demo.json`.
Es idempotente: si ya están ancladas con el mismo sello, no vuelve a enviar.

## Despliegue (Vercel)

1. Importa el repositorio en Vercel con directorio raíz `frontend`.
2. Agrega las variables de entorno de `.env.local`
   (`STELLAR_SECRET_KEY`, `STELLAR_PUBLIC_KEY`, `NEXT_PUBLIC_STELLAR_ACCOUNT`, `HORIZON_URL`).
3. Despliega y registra la URL pública en `docs/semana4/MVPFunctional.md` y en Apex.
