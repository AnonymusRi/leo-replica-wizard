# 🐘 Guida Configurazione Servizio PostgreSQL Railway

## 📋 Configurazione Variabili nel Servizio PostgreSQL

Railway richiede che alcune variabili siano configurate direttamente nel servizio PostgreSQL.

### Passo 1: Apri il Raw Editor del Servizio PostgreSQL

1. Vai su **Railway Dashboard** → Il tuo progetto
2. Clicca sul servizio **PostgreSQL** (NON sull'Application)
3. Vai su **Variables** → **Raw Editor**

### Passo 2: Copia e Incolla le Variabili

Copia **tutto** il contenuto del file `RAILWAY_POSTGRES_RAW_EDITOR.txt` e incollalo nel Raw Editor.

### Passo 3: Salva e Riavvia

1. Clicca su **Save** o **Update**
2. Vai su **Settings** → **Restart** per riavviare il servizio PostgreSQL

## 📝 Variabili Obbligatorie

Le variabili **minime** che devi avere nel servizio PostgreSQL sono:

```bash
POSTGRES_PASSWORD=vbhdKvSPFYkTySnfEqXjLCJibVJygGDm
POSTGRES_USER=postgres
POSTGRES_DB=railway
POSTGRES_HOST_AUTH_METHOD=scram-sha-256
PGHOST=0.0.0.0
PGPORT=5432
```

## 🔍 Verifica

Dopo aver salvato e riavviato:

1. **Controlla i log del servizio PostgreSQL**:
   - Dovresti vedere: `database system is ready to accept connections`
   - Non dovresti vedere errori di autenticazione

2. **Controlla i log del servizio Application**:
   - Dovresti vedere: `✅ Connected to PostgreSQL database`
   - Non dovresti vedere: `FATAL: password authentication failed`

## ⚠️ Importante

- **Le variabili nel servizio PostgreSQL** sono diverse da quelle nel servizio Application
- **Nel servizio Application** usa `${{postgres.*}}` per riferirti alle variabili del PostgreSQL
- **Nel servizio PostgreSQL** metti i valori diretti (password, user, ecc.)

## 🎯 Configurazione Completa

### Servizio PostgreSQL → Variables → Raw Editor

Usa il contenuto di `RAILWAY_POSTGRES_RAW_EDITOR.txt`

### Servizio Application → Variables → Raw Editor

Usa il contenuto di `RAILWAY_ENV_COMPLETE_RAW.txt` (che usa `${{postgres.*}}`)

## 🔧 Troubleshooting

### Errore: "password authentication failed"

**Causa**: Le variabili nel servizio PostgreSQL non sono configurate correttamente.

**Soluzione**:
1. Verifica che `POSTGRES_PASSWORD` sia presente nel servizio PostgreSQL
2. Verifica che la password corrisponda a quella usata nel servizio Application
3. Riavvia il servizio PostgreSQL dopo aver salvato le variabili

### Errore: "PGHOST not set"

**Causa**: `PGHOST` non è configurato nel servizio PostgreSQL.

**Soluzione**:
1. Aggiungi `PGHOST=0.0.0.0` nel servizio PostgreSQL → Variables → Raw Editor
2. Riavvia il servizio PostgreSQL

### Le variabili ${{postgres.*}} non funzionano

**Causa**: Railway non riesce a risolvere le variabili del servizio PostgreSQL.

**Soluzione**:
1. Verifica che il servizio PostgreSQL si chiami esattamente `postgres` (case-sensitive)
2. Se ha un nome diverso, aggiorna tutte le variabili `${{postgres.*}}` con il nome corretto
3. Alternativa: usa `RAILWAY_ENV_WITH_CREDENTIALS.txt` con credenziali hardcoded

