## Automatizar el worker de transcodificación

Este documento describe opciones simples para ejecutar el worker (`scripts/worker.cjs`) continuamente y procesar automáticamente los videos cuando se suban.

Requisitos:
- Tener las variables de entorno en un archivo seguro (ej: `.env.worker`) con al menos:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (IMPORTANTE: mantén esto secreto)

Opciones recomendadas:

1) Docker (recomendado para despliegues)

- Construir y ejecutar (en PowerShell):

```powershell
docker compose build
docker compose up -d
```

El servicio `transcode-worker` se reiniciará automáticamente si falla.

2) PM2 (rápido, en Linux/WSL o Windows con Node)

- Instalar PM2 globalmente:

```powershell
npm install -g pm2
```

- Arrancar el worker desde la carpeta del repo (asegúrate de exportar las variables de entorno antes):

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY='PASTA_TU_ROLE_KEY_AQUI'
pm2 start npm --name transcode-worker -- run -- worker
pm2 save
pm2 startup
```

3) NSSM (Windows Service Manager) — ejecutar el worker como servicio en Windows

- Descargar NSSM y crear servicio que ejecute `node .\scripts\worker.cjs` con las variables de entorno configuradas en el servicio.

Notas de seguridad:
- `SUPABASE_SERVICE_ROLE_KEY` es sensible: protege el archivo `.env.worker` y no lo subas a git.
- Para producción, usa un manager de secretos o variables de entorno del host/container.

Opciones adicionales:
- Si quieres re-procesar todos los videos existentes, pídemelo y añadiré una opción `--force` al worker.
