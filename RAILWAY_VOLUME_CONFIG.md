# 📦 Configurazione Volumi Railway

## ❌ Problema: Volume PostgreSQL Montato sul Servizio Sbagliato

Se hai montato il volume PostgreSQL sul servizio **Application**, devi spostarlo sul servizio **PostgreSQL**.

## ✅ Soluzione Corretta

### Il Volume PostgreSQL Deve Essere sul Servizio PostgreSQL

1. **Rimuovi il volume dal servizio Application**:
   - Vai su Railway Dashboard → Il tuo progetto → **Servizio Application**
   - Vai su **"Settings"** → **"Volumes"**
   - Trova il volume PostgreSQL
   - Clicca su **"Unmount"** o **"Remove"**

2. **Aggiungi il volume al servizio PostgreSQL**:
   - Vai su Railway Dashboard → Il tuo progetto → **Servizio PostgreSQL**
   - Vai su **"Settings"** → **"Volumes"**
   - Clicca su **"Add Volume"** o **"Mount Volume"**
   - Configura:
     - **Mount Path**: `/var/lib/postgresql/data`
     - **Size**: 50 GB (o quello che preferisci)
     - **Region**: EU West (Amsterdam, Netherlands) o la tua regione

## 📋 Configurazione Corretta dei Volumi

### Servizio PostgreSQL
- ✅ **Volume PostgreSQL**: Montato su `/var/lib/postgresql/data`
- ✅ **Size**: 50 GB (o quello che preferisci)
- ✅ **Region**: La stessa regione del servizio

### Servizio Application
- ❌ **NON deve avere** un volume PostgreSQL
- ✅ Può avere altri volumi se necessario (es: file uploads, cache)

## 🔍 Verifica

Dopo aver spostato il volume:

1. **Servizio PostgreSQL**:
   - Dovrebbe avere un volume montato su `/var/lib/postgresql/data`
   - I log dovrebbero mostrare: `Mounting volume on: /var/lib/containers/...`

2. **Servizio Application**:
   - NON dovrebbe avere un volume PostgreSQL
   - Dovrebbe avere solo le variabili d'ambiente per connettersi al database

## ⚠️ Importante

- Il volume PostgreSQL contiene i dati del database
- Deve essere montato sul servizio PostgreSQL, non sull'Application
- Se rimuovi il volume, perderai tutti i dati del database (a meno che non ci siano backup)

## 🎯 Configurazione Finale

### Servizio PostgreSQL
- Volume montato su `/var/lib/postgresql/data`
- Variabili d'ambiente gestite automaticamente da Railway

### Servizio Application
- **Nessun volume PostgreSQL**
- Variabili d'ambiente per connettersi al database:
  - `DATABASE_URL=${{NomeServizioPostgres.DATABASE_PRIVATE_URL}}`
  - `PGHOST=${{NomeServizioPostgres.PGHOST}}`
  - `PGPORT=5432`
  - E altre variabili (vedi `RAILWAY_ENV_COMPLETE_RAW.txt`)

