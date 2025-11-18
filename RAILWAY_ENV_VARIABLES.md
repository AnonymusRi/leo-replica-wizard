# 🔧 Configurazione Variabili d'Ambiente Railway

## ⚠️ IMPORTANTE: Variabili d'Ambiente nel Servizio Host

Quando hai un servizio PostgreSQL e un servizio applicazione su Railway, **devi esporre manualmente le variabili del database nel servizio applicazione** usando la sintassi di riferimento Railway.

## 📋 Passo 1: Identifica il Nome del Servizio PostgreSQL

1. Vai su Railway Dashboard → Il tuo progetto
2. Trova il servizio PostgreSQL nella lista
3. **Annota il nome esatto** del servizio (es: `Postgres`, `postgres`, `PostgreSQL`)

## 📋 Passo 2: Aggiungi Variabili nel Servizio Applicazione

1. Vai sul servizio **applicazione** (NON sul database)
2. Clicca su **"Variables"** o **"Environment Variables"**
3. Clicca su **"New Variable"** o **"Add Variable"**

### ✅ Opzione A: Usa DATABASE_URL (Consigliato - più semplice)

Aggiungi questa variabile:

```
Key: DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```

**⚠️ IMPORTANTE**: Sostituisci `Postgres` con il **nome esatto** del tuo servizio PostgreSQL (case-sensitive).

### ✅ Opzione B: Variabili Individuali (per compatibilità)

Se vuoi anche le variabili individuali, aggiungi:

```
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_DB=${{Postgres.PGDATABASE}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
DB_PORT=${{Postgres.PGPORT}}
```

### ✅ Opzione C: Variabili Alternative (se il codice usa DB\_\*)

Se il tuo codice usa variabili con prefisso `DB_*`, aggiungi anche:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true
```

**⚠️ IMPORTANTE**: La porta `5432` è la porta standard di PostgreSQL. Se usi `DATABASE_URL`, la porta è già inclusa nell'URL. Se usi variabili individuali, assicurati di includere `PGPORT` o `DB_PORT`.

## 📋 Passo 3: Variabili dell'Applicazione

Aggiungi anche queste variabili per l'applicazione:

```
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

## 🔤 Sintassi di Riferimento Railway

La sintassi per referenziare variabili di altri servizi è:

```
${{ServiceName.VariableName}}
```

**Esempi:**

- `${{Postgres.DATABASE_URL}}` - URL completo del database
- `${{Postgres.PGHOST}}` - Hostname del database
- `${{Postgres.PGDATABASE}}` - Nome del database

**⚠️ IMPORTANTE**: Il nome del servizio è **case-sensitive**!

## ✅ Verifica

Dopo aver aggiunto le variabili:

1. **Redeploy** il servizio applicazione (Railway lo farà automaticamente)
2. Controlla i **logs** del servizio applicazione
3. Dovresti vedere: `✅ Connected to PostgreSQL database`

## 🔍 Come Trovare il Nome del Servizio PostgreSQL

1. Vai su Railway Dashboard
2. Nel tuo progetto, vedi la lista dei servizi
3. Il nome del servizio PostgreSQL è quello che vedi nella lista
4. Se non sei sicuro, clicca sul servizio PostgreSQL e controlla l'URL o il nome nella barra laterale

## 🛠️ Esempio Completo

Nel servizio **applicazione**, aggiungi queste variabili:

```
# Database (referenza al servizio Postgres)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Application
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

**⚠️ Sostituisci `Postgres` con il nome esatto del tuo servizio PostgreSQL!**

## 🐛 Troubleshooting

### Le variabili non vengono risolte

- ✅ Verifica che il nome del servizio PostgreSQL sia **corretto** (case-sensitive)
- ✅ Assicurati di essere nel servizio **applicazione**, non nel servizio database
- ✅ Controlla che il servizio PostgreSQL sia nello **stesso progetto**
- ✅ Verifica che la sintassi sia corretta: `${{ServiceName.VariableName}}`

### Errore di connessione al database

- ✅ Verifica che tutte le variabili siano state aggiunte correttamente
- ✅ Controlla i log del servizio applicazione
- ✅ Assicurati che `DB_SSL=true` o che `DATABASE_URL` contenga `sslmode=require`

### Variabili non disponibili al runtime

- ✅ Railway applica le variabili durante il build e il deploy
- ✅ Se modifichi le variabili, devi fare un **redeploy** del servizio
- ✅ Controlla che non ci siano errori di sintassi nelle variabili

## 📚 Documentazione Ufficiale

- [Railway Variables Documentation](https://docs.railway.app/variables)
- [Railway Service References](https://docs.railway.app/variables#service-references)
