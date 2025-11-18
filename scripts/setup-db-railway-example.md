# Setup Database Railway - Istruzioni

Per eseguire lo script di setup del database con le credenziali Railway, usa uno di questi metodi:

## Metodo 1: Usando DATABASE_URL (consigliato)

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://postgres:joAQaUSfmlpndkkOSWlmNDwXUReFPdKy@[RAILWAY_PRIVATE_DOMAIN]:5432/railway"
node scripts/setup-db-railway.js
```

Sostituisci `[RAILWAY_PRIVATE_DOMAIN]` con il dominio privato Railway (es: `containers-us-west-xxx.railway.app`)

## Metodo 2: Usando variabili d'ambiente separate

```bash
# Windows PowerShell
$env:PGHOST="[RAILWAY_PRIVATE_DOMAIN]"
$env:PGPORT="5432"
$env:PGDATABASE="railway"
$env:PGUSER="postgres"
$env:PGPASSWORD="joAQaUSfmlpndkkOSWlmNDwXUReFPdKy"
$env:POSTGRES_DB="railway"
$env:POSTGRES_USER="postgres"
$env:POSTGRES_PASSWORD="joAQaUSfmlpndkkOSWlmNDwXUReFPdKy"
node scripts/setup-db-railway.js
```

## Metodo 3: Eseguire direttamente su Railway

Lo script viene già eseguito automaticamente durante il deploy grazie al comando in `railway.toml`:
```
startCommand = "npm run build && npm run setup:db && node scripts/start-server-with-api.js"
```

## Credenziali Railway

- **User**: postgres
- **Password**: joAQaUSfmlpndkkOSWlmNDwXUReFPdKy
- **Database**: railway
- **Port**: 5432
- **Host**: [RAILWAY_PRIVATE_DOMAIN] (da ottenere dal dashboard Railway)

