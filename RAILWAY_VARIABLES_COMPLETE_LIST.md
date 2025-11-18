# 📋 Lista Completa Variabili d'Ambiente Railway

## 🎯 Variabili da Aggiungere nel Servizio Applicazione

Vai su **Railway Dashboard** → **Il tuo progetto** → **Servizio Applicazione** → **Variables**

### 🔴 OBBLIGATORIE - Database (Scegli una opzione)

#### ✅ Opzione 1: DATABASE_URL (Consigliata - più semplice)

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**⚠️ IMPORTANTE**: Sostituisci `Postgres` con il nome esatto del tuo servizio PostgreSQL.

#### ✅ Opzione 2: Variabili Individuali PostgreSQL

Se preferisci le variabili individuali, aggiungi tutte queste:

```
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_DB=${{Postgres.PGDATABASE}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
```

#### ✅ Opzione 3: Variabili Alternative DB_* (per compatibilità)

Se il tuo codice usa variabili con prefisso `DB_*`, aggiungi:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true
```

---

### 🟢 OBBLIGATORIE - Applicazione

```
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

---

## 📝 Lista Completa (Tutte le Variabili)

Se vuoi aggiungere **tutte** le variabili per massima compatibilità, usa questa lista completa:

### Database - PostgreSQL (Referenze al servizio Postgres)

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_DB=${{Postgres.PGDATABASE}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
```

### Database - Variabili Alternative

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true
```

### Applicazione

```
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

---

## 🎯 Configurazione Minima Consigliata

Per la maggior parte dei casi, questa configurazione minima è sufficiente:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PGPORT=${{Postgres.PGPORT}}
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

**5 variabili!** 🎉

**Nota**: `PGPORT` è opzionale se usi `DATABASE_URL` (che include già la porta), ma è consigliato includerlo per compatibilità. La porta standard di PostgreSQL è `5432`.

---

## 📋 Come Aggiungere le Variabili

1. Vai su **Railway Dashboard**
2. Seleziona il tuo **progetto**
3. Clicca sul servizio **applicazione** (NON sul database)
4. Vai su **"Variables"** o **"Environment Variables"**
5. Per ogni variabile:
   - Clicca **"New Variable"** o **"Add Variable"**
   - Inserisci il **Key** (nome della variabile)
   - Inserisci il **Value** (valore della variabile)
   - Clicca **"Add"** o **"Save"**

---

## ⚠️ IMPORTANTE: Nome del Servizio PostgreSQL

**Prima di aggiungere le variabili**, devi sapere il nome esatto del tuo servizio PostgreSQL:

1. Vai su Railway Dashboard → Il tuo progetto
2. Nella lista dei servizi, trova il servizio PostgreSQL
3. **Annota il nome esatto** (es: `Postgres`, `postgres`, `PostgreSQL`)
4. Sostituisci `Postgres` nella sintassi `${{Postgres.Variabile}}` con il nome esatto

**Il nome è case-sensitive!** Quindi `Postgres` ≠ `postgres` ≠ `PostgreSQL`

---

## ✅ Verifica

Dopo aver aggiunto le variabili:

1. Railway farà automaticamente un **redeploy**
2. Vai su **Deployments** → **View Logs**
3. Cerca nel log: `✅ Connected to PostgreSQL database`
4. Se vedi questo messaggio, la connessione funziona! 🎉

---

## 🐛 Troubleshooting

### Le variabili non funzionano?

- ✅ Verifica che il nome del servizio PostgreSQL sia corretto (case-sensitive)
- ✅ Assicurati di essere nel servizio **applicazione**, non nel database
- ✅ Controlla che la sintassi sia: `${{NomeServizio.Variabile}}`
- ✅ Verifica che il servizio PostgreSQL sia nello stesso progetto

### Errore di connessione?

- ✅ Controlla i log del servizio applicazione
- ✅ Verifica che tutte le variabili siano state aggiunte
- ✅ Assicurati che `DB_SSL=true` o che `DATABASE_URL` contenga SSL

---

## 📚 Esempio Pratico

Se il tuo servizio PostgreSQL si chiama **"Postgres"**, aggiungi:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

Se il tuo servizio PostgreSQL si chiama **"postgres"** (minuscolo), aggiungi:

```
DATABASE_URL=${{postgres.DATABASE_URL}}
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
```

**Nota la differenza!** `Postgres` vs `postgres` - sono diversi!

