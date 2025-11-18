# 🚀 Quick Start - Deploy su Railway

## ⚡ Setup Rapido (5 minuti)

### 1. Commit e Push su GitHub

Apri Git Bash o Terminal nella directory del progetto e esegui:

```bash
cd C:\Users\Riccardo\leo-replica-wizard

# Aggiungi tutti i file
git add .

# Commit
git commit -m "Migrate from Supabase to PostgreSQL - Ready for Railway"

# Push
git push origin main
```

### 2. Collegare a Railway

1. Vai su https://railway.app e accedi
2. Clicca **"New Project"** → **"Deploy from GitHub repo"**
3. Autorizza Railway e seleziona `leo-replica-wizard`
4. Railway inizierà automaticamente il deploy

### 3. Aggiungere Database PostgreSQL

1. Nel progetto Railway, clicca **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creerà automaticamente il database e le variabili d'ambiente

### 4. Configurare Variabili d'Ambiente

Vai su **Settings** → **Variables** e aggiungi:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=8080
```

**Nota**: `${{Postgres.DATABASE_URL}}` viene popolato automaticamente da Railway.

### 5. Eseguire Schema Database

**Opzione A - Railway CLI (Consigliato):**

```bash
# Installa Railway CLI
npm i -g @railway/cli

# Accedi
railway login

# Collega progetto
railway link

# Esegui schema
railway run npm run setup:db
```

**Opzione B - Railway Dashboard:**

1. Vai su **Postgres** → **Query**
2. Copia tutto il contenuto di `database_schema.sql`
3. Incolla e esegui

### 6. Verificare Deploy

1. Vai su **Deployments**
2. Controlla che il deploy sia completato
3. Clicca sul dominio generato per vedere l'app

## ✅ Checklist Pre-Deploy

- [ ] Tutti i file committati e pushati su GitHub
- [ ] Repository collegata a Railway
- [ ] Database PostgreSQL creato su Railway
- [ ] Variabili d'ambiente configurate
- [ ] Schema database eseguito
- [ ] Deploy completato senza errori

## 🔧 File Importanti

- `database_schema.sql` - Schema da eseguire
- `railway.toml` - Configurazione Railway
- `scripts/setup-db.js` - Script setup database
- `RAILWAY_SETUP.md` - Guida dettagliata

## 🆘 Problemi Comuni

### Database Connection Error
- Verifica che `DATABASE_URL` sia configurata
- Controlla che il database PostgreSQL sia attivo

### Build Error
- Controlla i log in Railway
- Verifica che `package.json` sia corretto

### Schema Not Applied
- Esegui manualmente: `railway run npm run setup:db`
- Oppure usa Railway Dashboard → Postgres → Query

## 📚 Documentazione Completa

- `RAILWAY_SETUP.md` - Guida dettagliata Railway
- `MIGRATION_GUIDE.md` - Guida migrazione Supabase → PostgreSQL
- `COMMIT_AND_PUSH.md` - Istruzioni Git

## 🎉 Fatto!

Una volta completato, la tua app sarà live su Railway con database PostgreSQL!

