# 🔧 Fix Connessione Database Railway - Guida Completa

## ❌ Problema: `DATABASE_URL: ❌ Not set`

Se vedi questo errore, significa che Railway non sta risolvendo le variabili `${{Postgres.*}}`.

## 🔍 Diagnosi

Dai log vediamo:
```
DATABASE_URL: ❌ Not set
PGHOST: Not set
DB_HOST: Not set
```

Questo significa che le variabili di riferimento Railway non vengono risolte.

## ✅ Soluzione Passo-Passo

### Passo 1: Trova il Nome Esatto del Servizio PostgreSQL

1. Vai su **Railway Dashboard** → Il tuo progetto
2. Guarda la lista dei servizi nella sidebar sinistra
3. **Clicca sul servizio PostgreSQL**
4. Guarda l'URL nella barra degli indirizzi o il nome nella sidebar
5. **Annota il nome ESATTO** (es: `Postgres`, `postgres`, `PostgreSQL`, `leo-replica-wizard`)

**⚠️ IMPORTANTE**: Il nome è **case-sensitive**! `Postgres` ≠ `postgres`

### Passo 2: Verifica che i Servizi siano nello Stesso Progetto

1. Vai su Railway Dashboard
2. Verifica che **entrambi** i servizi (Application e PostgreSQL) siano nello **stesso progetto**
3. Se sono in progetti diversi, Railway non può risolvere le variabili di riferimento

### Passo 3: Aggiungi le Variabili nel Servizio Application

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio Application**
2. Clicca su **"Variables"** nella sidebar
3. Clicca su **"Raw Editor"** o **"Edit as Raw"**
4. **Cancella tutto** il contenuto esistente
5. Copia il contenuto di `RAILWAY_ENV_COMPLETE_RAW.txt`
6. **Sostituisci TUTTE le occorrenze di `Postgres`** con il nome esatto del tuo servizio PostgreSQL

**Esempio**: Se il servizio si chiama `leo-replica-wizard`, sostituisci:
- `${{Postgres.DATABASE_URL}}` → `${{leo-replica-wizard.DATABASE_URL}}`
- `${{Postgres.PGHOST}}` → `${{leo-replica-wizard.PGHOST}}`
- E così via per tutte le variabili

### Passo 4: Verifica la Sintassi

La sintassi corretta è:
```
${{NomeServizio.Variabile}}
```

**Esempi corretti**:
- `${{Postgres.DATABASE_URL}}`
- `${{postgres.DATABASE_URL}}`
- `${{leo-replica-wizard.DATABASE_URL}}`
- `${{PostgreSQL.DATABASE_URL}}`

**Esempi SBAGLIATI**:
- `${{Postgres.DATABASE_URL}}` (se il servizio si chiama `postgres` con la p minuscola)
- `{{Postgres.DATABASE_URL}}` (mancano i `$`)
- `${{Postgres DATABASE_URL}}` (manca il punto)

### Passo 5: Salva e Verifica

1. Clicca **"Save"** o **"Update"**
2. Railway farà automaticamente un redeploy
3. Vai su **Deployments** → **View Logs**
4. Cerca nei log:
   - `🔍 Environment check:`
   - `DATABASE_URL: ✅ Set` (dovrebbe essere ✅, non ❌)

## 🐛 Se Ancora Non Funziona

### Opzione A: Verifica Manuale delle Variabili

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio PostgreSQL**
2. Clicca su **"Variables"**
3. Verifica che queste variabili esistano:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

Se non esistono, il servizio PostgreSQL non è configurato correttamente.

### Opzione B: Usa Variabili Dirette (Non Consigliato)

Se le variabili di riferimento non funzionano, puoi copiare manualmente i valori:

1. Vai su **Servizio PostgreSQL** → **Variables**
2. Copia il valore di `DATABASE_URL`
3. Vai su **Servizio Application** → **Variables**
4. Aggiungi: `DATABASE_URL=<valore copiato>`

**⚠️ NOTA**: Questo non è consigliato perché i valori cambiano quando Railway riavvia il servizio.

### Opzione C: Verifica il Networking

1. Verifica che entrambi i servizi siano **attivi** (non in pausa)
2. Verifica che il servizio PostgreSQL sia **pronto** (vedi i log: `database system is ready to accept connections`)
3. Se il servizio PostgreSQL è in pausa, **riavvialo**

## 📝 Checklist Finale

Prima di salvare, verifica:

- [ ] Il nome del servizio PostgreSQL è corretto (case-sensitive)
- [ ] Entrambi i servizi sono nello stesso progetto Railway
- [ ] La sintassi è corretta: `${{NomeServizio.Variabile}}`
- [ ] Tutte le occorrenze di `Postgres` sono state sostituite con il nome corretto
- [ ] Il servizio PostgreSQL è attivo e pronto
- [ ] Le variabili sono state salvate nel servizio **Application**, non nel servizio PostgreSQL

## 🎯 Esempio Completo

Se il tuo servizio PostgreSQL si chiama `leo-replica-wizard`, nel servizio Application devi avere:

```
DATABASE_URL=${{leo-replica-wizard.DATABASE_URL}}
PGHOST=${{leo-replica-wizard.PGHOST}}
PGPORT=5432
PGDATABASE=${{leo-replica-wizard.PGDATABASE}}
PGUSER=${{leo-replica-wizard.PGUSER}}
PGPASSWORD=${{leo-replica-wizard.PGPASSWORD}}
DB_HOST=${{leo-replica-wizard.PGHOST}}
DB_PORT=5432
DB_NAME=${{leo-replica-wizard.PGDATABASE}}
DB_USER=${{leo-replica-wizard.PGUSER}}
DB_PASSWORD=${{leo-replica-wizard.PGPASSWORD}}
DB_SSL=true
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
VITE_PUBLIC_URL=https://alidaunia-production.up.railway.app
VITE_API_URL=https://alidaunia-production.up.railway.app/api
VITE_APP_ENV=production
NPM_CONFIG_LEGACY_PEER_DEPS=true
NIXPACKS_PKG_MGR=npm
```

**⚠️ Sostituisci `leo-replica-wizard` con il nome esatto del tuo servizio PostgreSQL!**

