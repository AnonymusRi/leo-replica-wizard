# ✅ Checklist Deploy Railway

## 📋 Verifica Log di Deploy

Dopo il deploy, verifica che tutti questi step siano completati:

### 1. ✅ Build Vite
```
✓ built in 12.48s
✓ 3555 modules transformed.
```
**Stato**: ✅ Completato

### 2. ⏳ Setup Database
Dovresti vedere nei log:
```
📦 Setting up database schema...
📝 Executing 25 SQL statements...
✅ Database schema setup completed!
📊 Found 64 tables in database
```
**Verifica**: Controlla i log per vedere se `npm run setup:db` è stato eseguito

### 3. ⏳ Avvio Server
Dovresti vedere nei log:
```
🚀 Starting server...
Port: 5000
Host: 0.0.0.0
✅ Server running on http://0.0.0.0:5000
✅ Connected to PostgreSQL database
```
**Verifica**: Controlla i log per vedere se il server è avviato

## 🔍 Cosa Controllare

### Se il Deploy si è Fermato dopo il Build

1. **Controlla i log completi**:
   - Vai su Railway Dashboard → Il tuo progetto → Servizio Application
   - Vai su **Deployments** → Clicca sull'ultimo deploy
   - Controlla tutti i log, non solo quelli iniziali

2. **Verifica lo startCommand**:
   - Dovrebbe essere: `npm run build && npm run setup:db && node scripts/start-server-with-api.js`
   - Controlla in `railway.toml` che sia corretto

3. **Verifica le variabili d'ambiente**:
   - Vai su **Variables** → Verifica che `DATABASE_URL` o `${{postgres.DATABASE_PRIVATE_URL}}` sia presente
   - Verifica che tutte le variabili necessarie siano configurate

### Se Vedi Errori

#### Errore: `DATABASE_URL: ❌ Not set`
**Soluzione**: Aggiungi le variabili d'ambiente dal file `RAILWAY_ENV_COMPLETE_RAW.txt`

#### Errore: `ECONNREFUSED` o `Database not ready yet`
**Soluzione**: 
- Verifica che il servizio PostgreSQL sia attivo
- Verifica che `PGHOST` sia `postgres.railway.internal` o il valore corretto
- Controlla i log del servizio PostgreSQL

#### Errore: `relation "table_name" does not exist`
**Soluzione**: 
- Verifica che `npm run setup:db` sia stato eseguito
- Controlla i log per vedere se ci sono errori durante lo setup del database

#### Errore: `syntax error at or near ":"`
**Soluzione**: Questo è un errore nelle query SQL. Controlla i log per vedere quale query sta causando il problema.

## 📊 Log Attesi

Dopo il build, dovresti vedere questa sequenza:

```
✓ built in 12.48s
📦 Setting up database schema...
📝 Executing 25 SQL statements...
✅ Database schema setup completed!
🚀 Starting server...
✅ Server running on http://0.0.0.0:5000
✅ Connected to PostgreSQL database
```

## 🎯 Prossimi Passi

1. **Controlla i log completi** del deploy
2. **Verifica che il server sia avviato** (dovresti vedere "Server running")
3. **Testa l'applicazione** visitando l'URL Railway
4. **Controlla i log in tempo reale** per vedere se ci sono errori runtime

## ⚠️ Note

- Il warning sui chunk size è normale e non blocca il deploy
- Il warning su browserslist è solo informativo
- Se il deploy si ferma dopo il build, controlla i log completi per vedere dove si è fermato

