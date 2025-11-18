# 🔧 Troubleshooting Railway Database Connection

## ❌ Problema: `DATABASE_URL: ❌ Not set`

Se vedi questo errore nei log, significa che le variabili del database non sono configurate correttamente nel servizio Application.

## ✅ Soluzione Passo-Passo

### 1. Verifica il Nome del Servizio PostgreSQL

1. Vai su **Railway Dashboard** → Il tuo progetto
2. Guarda la lista dei servizi
3. **Annota il nome esatto** del servizio PostgreSQL (es: `Postgres`, `postgres`, `PostgreSQL`, `leo-replica-wizard`)

### 2. Aggiungi le Variabili nel Servizio Application

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio Application**
2. Clicca su **"Variables"**
3. Clicca su **"Raw Editor"** o **"Edit as Raw"**
4. Copia e incolla il contenuto di `RAILWAY_ENV_COMPLETE_RAW.txt`
5. **IMPORTANTE**: Sostituisci `Postgres` con il nome esatto del tuo servizio PostgreSQL

### 3. Verifica le Variabili

Dopo aver salvato, verifica che le variabili siano presenti:

- ✅ `DATABASE_URL=${{NomeServizio.DATABASE_URL}}`
- ✅ `PGHOST=${{NomeServizio.PGHOST}}`
- ✅ `PGPORT=5432` (porta esplicita)
- ✅ `PGDATABASE=${{NomeServizio.PGDATABASE}}`
- ✅ `PGUSER=${{NomeServizio.PGUSER}}`
- ✅ `PGPASSWORD=${{NomeServizio.PGPASSWORD}}`
- ✅ `DB_HOST=${{NomeServizio.PGHOST}}`
- ✅ `DB_PORT=5432` (porta esplicita)
- ✅ `DB_NAME=${{NomeServizio.PGDATABASE}}`
- ✅ `DB_USER=${{NomeServizio.PGUSER}}`
- ✅ `DB_PASSWORD=${{NomeServizio.PGPASSWORD}}`
- ✅ `DB_SSL=true`

### 4. Verifica che il Servizio PostgreSQL sia Attivo

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio PostgreSQL**
2. Controlla i log - dovresti vedere: `database system is ready to accept connections`
3. Se non è attivo, riavvia il servizio

### 5. Redeploy il Servizio Application

Dopo aver aggiunto le variabili:
1. Railway farà automaticamente un redeploy
2. Oppure vai su **Deployments** → **Redeploy**

## 🔍 Come Trovare il Nome Esatto del Servizio PostgreSQL

Il nome del servizio è quello che vedi nella lista dei servizi su Railway. Esempi comuni:
- `Postgres`
- `postgres`
- `PostgreSQL`
- `leo-replica-wizard`
- `database`

**⚠️ IMPORTANTE**: Il nome è **case-sensitive**! `Postgres` ≠ `postgres`

## 🐛 Errori Comuni

### Errore: `DATABASE_URL: ❌ Not set`

**Causa**: La variabile `DATABASE_URL=${{Postgres.DATABASE_URL}}` non è presente o il nome del servizio è sbagliato.

**Soluzione**: 
1. Verifica che `DATABASE_URL=${{NomeServizio.DATABASE_URL}}` sia presente nel Raw Editor
2. Verifica che il nome del servizio sia corretto (case-sensitive)

### Errore: `ECONNREFUSED`

**Causa**: Il database non è ancora pronto o le variabili non sono configurate correttamente.

**Soluzione**:
1. Verifica che il servizio PostgreSQL sia attivo (vedi i log)
2. Verifica che tutte le variabili siano presenti nel servizio Application
3. Attendi che il database sia pronto (lo script fa retry automaticamente)

### Errore: Variabili non risolte

**Causa**: La sintassi `${{NomeServizio.Variabile}}` non è corretta o il servizio PostgreSQL non è nello stesso progetto.

**Soluzione**:
1. Verifica la sintassi: `${{NomeServizio.Variabile}}` (con doppie graffe)
2. Verifica che il servizio PostgreSQL sia nello stesso progetto Railway
3. Verifica che il nome del servizio sia esatto (case-sensitive)

## 📝 Esempio Completo

Nel servizio **Application** → **Variables** → **Raw Editor**, incolla:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PGHOST=${{Postgres.PGHOST}}
PGPORT=5432
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=5432
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
VITE_PUBLIC_URL=https://tuo-dominio.up.railway.app
VITE_API_URL=https://tuo-dominio.up.railway.app/api
VITE_APP_ENV=production
NPM_CONFIG_LEGACY_PEER_DEPS=true
NIXPACKS_PKG_MGR=npm
```

**⚠️ Sostituisci `Postgres` con il nome esatto del tuo servizio PostgreSQL!**

