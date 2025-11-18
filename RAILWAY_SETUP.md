# 🚂 Configurazione Railway per LEO Replica Wizard

## Prerequisiti

1. Account Railway: https://railway.app
2. Repository GitHub con tutti i cambiamenti pushati
3. Database PostgreSQL (Railway può crearne uno automaticamente)

## Passo 1: Collegare Repository a Railway

1. Vai su https://railway.app e accedi
2. Clicca su **"New Project"**
3. Seleziona **"Deploy from GitHub repo"**
4. Autorizza Railway ad accedere al tuo GitHub
5. Seleziona la repository: `AnonymusRi/leo-replica-wizard`
6. Railway inizierà automaticamente il deploy

## Passo 2: Configurare Database PostgreSQL

### Opzione A: Database Railway (Consigliato)

1. Nel progetto Railway, clicca su **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creerà automaticamente un database PostgreSQL
3. Railway fornirà automaticamente le variabili d'ambiente:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   - `DATABASE_URL` (connection string completa)

### Opzione B: Database Esterno

Se hai già un database PostgreSQL esterno, aggiungi queste variabili d'ambiente:

1. Vai su **Settings** → **Variables**
2. Aggiungi le seguenti variabili:

```
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=leo_replica_wizard
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true
```

## Passo 3: Configurare Variabili d'Ambiente

Nel progetto Railway, vai su **Settings** → **Variables** e aggiungi:

```env
# Database (se non usi il database Railway)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true

# Oppure usa direttamente DATABASE_URL se disponibile
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Application
NODE_ENV=production
PORT=8080
```

**Nota**: Se usi il database PostgreSQL di Railway, le variabili `${{Postgres.*}}` vengono popolate automaticamente.

## Passo 4: Eseguire lo Schema Database

### Metodo 1: Usando Railway CLI

1. Installa Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Accedi:
   ```bash
   railway login
   ```

3. Collega il progetto:
   ```bash
   railway link
   ```

4. Esegui lo schema SQL:
   ```bash
   railway run psql ${{Postgres.DATABASE_URL}} < database_schema.sql
   ```

### Metodo 2: Usando Railway Dashboard

1. Vai su **Postgres** → **Query**
2. Copia e incolla il contenuto di `database_schema.sql`
3. Esegui la query

### Metodo 3: Script di Setup

Crea uno script che Railway esegue al deploy. Aggiungi questo a `package.json`:

```json
{
  "scripts": {
    "setup:db": "psql $DATABASE_URL -f database_schema.sql || echo 'Schema already exists or error occurred'"
  }
}
```

Poi in Railway, aggiungi un **"Deploy Hook"** che esegue `npm run setup:db` dopo il deploy.

## Passo 5: Configurare Build Settings

Railway dovrebbe rilevare automaticamente che è un progetto Node.js, ma verifica:

1. Vai su **Settings** → **Build**
2. Assicurati che:
   - **Build Command**: `npm install` (o lasciato vuoto)
   - **Start Command**: `npm run dev` (sviluppo) o `npm run build && npm run preview` (produzione)

### Per Produzione:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "vite build"
  }
}
```

E configura Railway per usare `npm start` come comando di start.

## Passo 6: Configurare Porta

Railway assegna automaticamente una porta tramite la variabile `PORT`. Assicurati che `vite.config.ts` usi:

```typescript
export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '8080'),
    host: '0.0.0.0', // Importante per Railway
  },
  // ...
});
```

## Passo 7: Deploy

1. Railway dovrebbe fare il deploy automatico ad ogni push su `main`
2. Puoi anche fare deploy manuale da **Deployments** → **Redeploy**
3. Controlla i log per eventuali errori

## Troubleshooting

### Database Connection Error

- Verifica che tutte le variabili d'ambiente siano configurate
- Controlla che il database sia accessibile da Railway
- Verifica che `DB_SSL=true` se il database richiede SSL

### Build Error

- Controlla i log di build in Railway
- Verifica che `package.json` sia corretto
- Assicurati che tutte le dipendenze siano installate

### Schema Not Applied

- Esegui manualmente lo schema usando Railway CLI o Dashboard
- Verifica che il database sia vuoto prima di applicare lo schema

## Monitoraggio

- **Logs**: Vai su **Deployments** → Seleziona deployment → **View Logs**
- **Metrics**: Railway mostra CPU, Memory, Network usage
- **Database**: Vai su **Postgres** → **Metrics** per vedere usage del database

## Domini Personalizzati

1. Vai su **Settings** → **Domains**
2. Clicca **"Generate Domain"** per un dominio Railway gratuito
3. Oppure aggiungi il tuo dominio personalizzato

## Backup Database

Railway fa backup automatici del database PostgreSQL. Puoi:
- Vedi backup in **Postgres** → **Backups**
- Ripristina da backup se necessario

## Costi

- Railway offre un piano gratuito con $5 di credito mensile
- PostgreSQL su Railway: ~$5/mese per database base
- Verifica i prezzi aggiornati su https://railway.app/pricing

## Link Utili

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)

