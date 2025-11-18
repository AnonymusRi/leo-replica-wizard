# 🚂 Configurazione Completa Servizi Railway

## 📋 Configurazione Servizio PostgreSQL

### ⚠️ Se vedi l'errore "Database is uninitialized and superuser password is not specified":

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio PostgreSQL**
2. Vai su **"Variables"** → **"Raw Editor"**
3. Copia e incolla il contenuto del file `RAILWAY_POSTGRES_VARIABLES.txt`
4. Salva

### Variabili Automatiche del Servizio Postgres:
Railway fornisce automaticamente queste variabili nel servizio PostgreSQL:
- `PGHOST` - Hostname del database
- `PGPORT` - Porta (5432)
- `PGDATABASE` - Nome del database
- `PGUSER` - Utente del database
- `PGPASSWORD` - Password del database
- `DATABASE_URL` - Connection string completa

**Nota**: Normalmente Railway gestisce tutto automaticamente, ma se vedi errori di inizializzazione, aggiungi le variabili manualmente.

---

## 📋 Configurazione Servizio Application

Nel servizio **Application**, devi aggiungere le variabili d'ambiente usando il **Raw Editor**.

### Passo 1: Apri il Raw Editor

1. Vai su **Railway Dashboard**
2. Seleziona il tuo **progetto**
3. Clicca sul servizio **Application** (NON sul database)
4. Vai su **"Variables"**
5. Clicca su **"Raw Editor"** o **"Edit as Raw"**

### Passo 2: Copia e Incolla

Copia tutto il contenuto del file `RAILWAY_ENV_COMPLETE_RAW.txt` e incollalo nel Raw Editor.

### Passo 3: Personalizza

**Prima di salvare**, sostituisci:

1. **`Postgres`** → Nome esatto del tuo servizio PostgreSQL
   - Esempio: se il servizio si chiama `postgres`, usa `${{postgres.DATABASE_URL}}`
   - Esempio: se il servizio si chiama `PostgreSQL`, usa `${{PostgreSQL.DATABASE_URL}}`
   - **IMPORTANTE**: Le variabili `${{Postgres.*}}` sono riferimenti che Railway risolve automaticamente
   - Queste variabili DEVONO essere nel servizio **Application**, non nel servizio Postgres!

2. **`alidaunia-production.up.railway.app`** → Il tuo dominio Railway
   - Trova il dominio in: Railway Dashboard → Il tuo progetto → Servizio Application → Settings → Domains
   - Esempio: `https://tuo-progetto.up.railway.app`

### Passo 4: Salva

Clicca **"Save"** o **"Update"**. Railway farà automaticamente un redeploy.

---

## ✅ Verifica

Dopo aver salvato le variabili:

1. Vai su **Deployments** → **View Logs**
2. Cerca nel log:
   - `✅ Connected to PostgreSQL database` - Connessione DB OK
   - `✅ Server running on http://0.0.0.0:5000` - Server OK
   - `✅ Database schema setup completed!` - Schema OK

---

## 🔍 Come Trovare il Nome del Servizio PostgreSQL

1. Vai su Railway Dashboard → Il tuo progetto
2. Nella lista dei servizi, trova il servizio PostgreSQL
3. Il nome è quello che vedi nella lista (es: `Postgres`, `postgres`, `PostgreSQL`)
4. **Il nome è case-sensitive!** Quindi `Postgres` ≠ `postgres`

---

## 🔍 Come Trovare il Dominio dell'Applicazione

1. Vai su Railway Dashboard → Il tuo progetto
2. Clicca sul servizio **Application**
3. Vai su **Settings** → **Domains**
4. Trova il dominio pubblico (es: `alidaunia-production.up.railway.app`)
5. Usa questo dominio per `VITE_PUBLIC_URL` e `VITE_API_URL`

---

## 📝 Lista Completa Variabili (per riferimento)

Vedi il file `RAILWAY_ENV_COMPLETE_RAW.txt` per la lista completa.

### Variabili Database (Referenze al servizio Postgres):
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `PGHOST=${{Postgres.PGHOST}}`
- `PGPORT=${{Postgres.PGPORT}}` (porta 5432)
- `PGDATABASE=${{Postgres.PGDATABASE}}`
- `PGUSER=${{Postgres.PGUSER}}`
- `PGPASSWORD=${{Postgres.PGPASSWORD}}`
- `DB_HOST=${{Postgres.PGHOST}}`
- `DB_PORT=${{Postgres.PGPORT}}`
- `DB_NAME=${{Postgres.PGDATABASE}}`
- `DB_USER=${{Postgres.PGUSER}}`
- `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- `DB_SSL=true`

### Variabili Applicazione:
- `NODE_ENV=production`
- `PORT=5000`
- `RAILWAY_ENVIRONMENT=true`

### Variabili Vite:
- `VITE_PUBLIC_URL=https://tuo-dominio.up.railway.app`
- `VITE_API_URL=https://tuo-dominio.up.railway.app/api`
- `VITE_APP_ENV=production`

### Variabili Build:
- `NPM_CONFIG_LEGACY_PEER_DEPS=true`
- `NIXPACKS_PKG_MGR=npm`

---

## 🐛 Troubleshooting

### Le variabili non funzionano?

- ✅ Verifica che il nome del servizio PostgreSQL sia corretto (case-sensitive)
- ✅ Assicurati di essere nel servizio **Application**, non nel database
- ✅ Controlla che la sintassi sia: `${{NomeServizio.Variabile}}`
- ✅ Verifica che il servizio PostgreSQL sia nello stesso progetto

### Errore di connessione al database?

- ✅ Controlla i log del servizio Application
- ✅ Verifica che tutte le variabili siano state aggiunte
- ✅ Assicurati che `DB_SSL=true` o che `DATABASE_URL` contenga SSL

### L'applicazione non si connette all'API?

- ✅ Verifica che `VITE_API_URL` sia corretto
- ✅ Controlla che il dominio sia quello giusto
- ✅ Assicurati che l'URL non finisca con `/` (es: `https://...app/api` non `https://...app/api/`)

---

## 📚 Documentazione Railway

- [Railway Variables](https://docs.railway.app/variables)
- [Railway Service References](https://docs.railway.app/variables#service-references)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)

