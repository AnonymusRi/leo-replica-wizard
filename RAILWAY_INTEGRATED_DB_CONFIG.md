# 🔧 Configurazione Database Integrato Railway

## 📋 Database PostgreSQL Integrato nel Servizio Application

Se il database PostgreSQL è **integrato** nel servizio Application (non è un servizio separato), la configurazione è diversa.

## ✅ Configurazione per Database Integrato

### Passo 1: Verifica che il Database sia Integrato

1. Vai su Railway Dashboard → Il tuo progetto → **Servizio Application**
2. Vai su **"Settings"** → **"Volumes"**
3. Se vedi un volume montato su `/var/lib/postgresql/data`, il database è integrato

### Passo 2: Aggiungi le Variabili d'Ambiente

Quando il database è integrato, Railway fornisce automaticamente le variabili d'ambiente **direttamente nel servizio Application**, senza bisogno di riferimenti a un altro servizio.

1. Vai su Railway Dashboard → Il tuo progetto → **Servizio Application**
2. Vai su **"Variables"** → **"Raw Editor"**
3. Copia il contenuto di `RAILWAY_ENV_INTEGRATED_DB.txt`

### Passo 3: Verifica le Variabili Automatiche

Railway dovrebbe fornire automaticamente queste variabili quando il database è integrato:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

**Se queste variabili sono già presenti**, non devi aggiungerle manualmente. Railway le gestisce automaticamente.

## 🔍 Come Verificare

1. Vai su **Servizio Application** → **Variables**
2. Controlla se vedi già queste variabili:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGDATABASE`
   - ecc.

3. Se sono presenti, Railway le sta già fornendo automaticamente
4. Se NON sono presenti, aggiungi le variabili manualmente usando `RAILWAY_ENV_INTEGRATED_DB.txt`

## ⚠️ Importante

- Se il database è integrato, **NON usare** `${{Postgres.*}}` perché non c'è un servizio PostgreSQL separato
- Railway fornisce le variabili direttamente nel servizio Application
- Il volume PostgreSQL è montato sul servizio Application stesso

## 🎯 Configurazione Minima

Se Railway fornisce già le variabili automaticamente, aggiungi solo:

```
NODE_ENV=production
PORT=5000
RAILWAY_ENVIRONMENT=true
VITE_PUBLIC_URL=https://alidaunia-production.up.railway.app
VITE_API_URL=https://alidaunia-production.up.railway.app/api
VITE_APP_ENV=production
NPM_CONFIG_LEGACY_PEER_DEPS=true
NIXPACKS_PKG_MGR=npm
```

Le variabili del database (`DATABASE_URL`, `PGHOST`, ecc.) sono già gestite automaticamente da Railway.

## 🐛 Se le Variabili Non Sono Disponibili

Se Railway NON fornisce automaticamente le variabili del database:

1. Vai su **Servizio Application** → **Variables**
2. Aggiungi manualmente le variabili da `RAILWAY_ENV_INTEGRATED_DB.txt`
3. Se `${{.VARIABLE}}` non funziona, prova senza il punto: `${{VARIABLE}}`
4. Se anche questo non funziona, usa i valori diretti (ma non è consigliato perché cambiano)

