# Apex Blockchain - Functional Proof

Instrucciones para ejecutar el proyecto frontend de la entrega Módulo 3.

## Requisitos

- Navegador web moderno (Google Chrome, Brave, Edge o Firefox).
- Extensión *Freighter Wallet* instalada en el navegador (configurada en la red *Testnet*).

## Instalación

1. Clona el repositorio en tu equipo:
   ```bash
   git clone [https://github.com/ephemeral444/apex-blockchain.git

2. Entra a la carpeta del proyecto:

Bash:
cd apex-blockchain

Cómo correrlo
El proyecto se puede ejecutar de dos formas distintas:

Opción A: Mediante un servidor local (Recomendado)
Desde la terminal, ingresa a la carpeta frontend:

PowerShell: 
cd frontend

Luego inicia el servidor según las herramientas instaladas en tu equipo:

Usando Node.js / npx:
PowerShell:
npx serve

Abre en tu navegador la dirección indicada en la consola: http://localhost:3000

Usando Python:
PowerShell:

python -m http.server 8000
Abre en tu navegador la dirección: http://localhost:8000

Opción B: Abrir directamente en el navegador (Sin instalar nada)
Abre el explorador de archivos de tu sistema operativo.

Navega hasta la ruta apex-blockchain/frontend.

Haz doble clic sobre el archivo index.html (o haz clic derecho -> Abrir con -> tu navegador web).

Paso a paso para usar la aplicación
Configurar la billetera: Abre la extensión Freighter Wallet en tu navegador, ve a la configuración y asegúrate de seleccionar la red Testnet.

Conectar a la App: En la interfaz web del proyecto, haz clic en el botón azul "Conectar Billetera" ubicado en la esquina superior derecha.

Aprobar la conexión: En la ventana emergente de Freighter, haz clic en Approve o Connect. Verás que el estado de la aplicación cambia a Conectado (Testnet) y se muestra tu clave pública.

Probar la operación del MVP:
En el campo Dirección Destino / Cuenta, ingresa una clave pública de prueba de Stellar (que empiece con la letra G...).

En el campo Monto / Valor, ingresa una cantidad (por ejemplo: 10.0).

Haz clic en el botón verde "Ejecutar Operación".

Verificar el resultado: Revisa la caja de Registro de Actividad en la parte inferior de la pantalla para confirmar los detalles de la transacción simulada en la Testnet.