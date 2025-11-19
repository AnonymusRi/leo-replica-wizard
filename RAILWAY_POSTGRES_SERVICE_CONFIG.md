# 🐘 Configurazione Servizio PostgreSQL Separato

## ✅ Situazione Attuale

Il tuo progetto Railway ha:
- **Servizio Application**: La tua applicazione Node.js
- **Servizio PostgreSQL**: Database separato con nome `postgres`

## 📋 Configurazione Variabili d'Ambiente

### Nel Servizio Application

Copia il contenuto di `RAILWAY_ENV_COMPLETE_RAW.txt` nel **Raw Editor** del servizio **Application**:

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio Application**
2. Vai su **Variables** → **Raw Editor**
3. Copia e incolla tutto il contenuto di `RAILWAY_ENV_COMPLETE_RAW.txt`
4. **IMPORTANTE**: Le variabili usano `${{postgres.*}}` perché il servizio PostgreSQL si chiama `postgres`
5. Salva

### Variabili Chiave

Le variabili più importanti sono:
```
DATABASE_URL=${{postgres.DATABASE_PRIVATE_URL}}
PGHOST=${{postgres.PGHOST}}
PGDATABASE=${{postgres.PGDATABASE}}
PGUSER=${{postgres.PGUSER}}
PGPASSWORD=${{postgres.PGPASSWORD}}
```

Railway risolverà automaticamente `${{postgres.*}}` con i valori del servizio PostgreSQL.

## 🔍 Verifica Configurazione

### 1. Verifica il Nome del Servizio PostgreSQL

1. Vai su **Railway Dashboard** → Il tuo progetto
2. Controlla il nome esatto del servizio PostgreSQL
3. Se si chiama diversamente da `postgres`, aggiorna tutte le variabili `${{postgres.*}}` con il nome corretto

### 2. Verifica le Variabili nel Servizio Application

Dopo aver salvato le variabili, verifica che siano presenti:
- `DATABASE_URL` (dovrebbe contenere `postgres.railway.internal`)
- `PGHOST` (dovrebbe essere `postgres.railway.internal`)
- `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### 3. Verifica la Connessione

Dopo il deploy, controlla i log del servizio Application:
- Dovresti vedere: `✅ Connected to PostgreSQL database`
- Non dovresti vedere errori `ECONNREFUSED`

## 🚀 Deploy

Dopo aver configurato le variabili:

1. Railway farà automaticamente un redeploy
2. Il Dockerfile verrà usato per buildare l'applicazione
3. Lo script `setup:db` creerà lo schema del database
4. L'applicazione si connetterà al servizio PostgreSQL separato

## ⚠️ Note Importanti

- **Non serve** installare PostgreSQL nel Dockerfile (è un servizio separato)
- **Non serve** avviare PostgreSQL nello script di avvio
- Il servizio PostgreSQL è gestito automaticamente da Railway
- Le connessioni usano `postgres.railway.internal` per il networking privato
- SSL è abilitato per le connessioni Railway

## 🔧 Troubleshooting

### Errore: `DATABASE_URL: ❌ Not set`

**Causa**: Le variabili non sono state configurate correttamente o il nome del servizio è sbagliato.

**Soluzione**:
1. Verifica che il servizio PostgreSQL si chiami esattamente `postgres`
2. Se ha un nome diverso, aggiorna tutte le variabili `${{postgres.*}}` con il nome corretto
3. Verifica che le variabili siano nel servizio **Application**, non nel servizio PostgreSQL

### Errore: `ECONNREFUSED`

**Causa**: Il servizio PostgreSQL non è attivo o le variabili puntano all'host sbagliato.

**Soluzione**:
1. Verifica che il servizio PostgreSQL sia attivo (stato "Running")
2. Verifica che `PGHOST` sia `postgres.railway.internal` o il valore corretto
3. Controlla i log del servizio PostgreSQL per eventuali errori

### Errore: `relation "table_name" does not exist`

**Causa**: Lo schema del database non è stato creato.

**Soluzione**:
1. Verifica che `npm run setup:db` sia eseguito durante il deploy
2. Controlla i log del deploy per vedere se `setup:db` è stato eseguito correttamente
3. Se necessario, esegui manualmente: `npm run setup:db`

