# 🚀 Setup Database con Railway CLI

## ✅ Metodo Semplificato con Railway CLI

Invece di configurare manualmente tutte le variabili, possiamo usare Railway CLI che gestisce automaticamente la connessione.

## 📋 Prerequisiti

### 1. Installa Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login in Railway CLI

```bash
railway login
```

Questo aprirà il browser per autenticarti.

### 3. Seleziona il Progetto

```bash
railway link
```

Oppure se hai già linkato il progetto:
```bash
cd /path/to/your/project
railway link
```

## 🎯 Eseguire lo Schema del Database

### Metodo 1: Usa lo Script NPM

```bash
npm run setup:db:cli
```

Questo script:
1. Verifica che Railway CLI sia installato
2. Verifica che tu sia loggato
3. Esegue lo schema usando `railway connect postgres`

### Metodo 2: Usa Railway CLI Direttamente

```bash
railway connect postgres < database_schema.sql
```

Oppure interattivo:
```bash
railway connect postgres
# Poi incolla lo schema o esegui comandi SQL
```

### Metodo 3: Esegui Comandi SQL Singoli

```bash
railway connect postgres -c "SELECT version();"
```

## 🔍 Verifica la Connessione

```bash
railway connect postgres -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

## 📝 Variabili d'Ambiente con Railway CLI

Railway CLI può anche gestire le variabili d'ambiente:

### Vedere le Variabili

```bash
railway variables
```

### Aggiungere una Variabile

```bash
railway variables set DATABASE_URL=${{postgres.DATABASE_URL}}
```

### Aggiungere Multiple Variabili

```bash
railway variables set DATABASE_URL=${{postgres.DATABASE_URL}} PGHOST=${{postgres.PGHOST}}
```

## 🎯 Vantaggi di Railway CLI

1. ✅ **Gestione automatica della connessione** - Non serve configurare manualmente host/port
2. ✅ **Autenticazione automatica** - Railway CLI gestisce le credenziali
3. ✅ **Rete privata automatica** - Usa automaticamente la rete privata
4. ✅ **Più semplice** - Meno configurazione manuale
5. ✅ **Più veloce** - Meno errori di configurazione

## ⚠️ Note

- Railway CLI deve essere eseguito **localmente** (non nel container Railway)
- Per il deploy su Railway, usa ancora `npm run setup:db` che usa le variabili d'ambiente
- Railway CLI è utile per setup iniziale e manutenzione, non per il deploy automatico

## 🔧 Troubleshooting

### Errore: "railway: command not found"

```bash
npm install -g @railway/cli
```

### Errore: "Not logged in"

```bash
railway login
```

### Errore: "No project linked"

```bash
railway link
```

### Verifica il Progetto Corretto

```bash
railway status
```

## 📖 Documentazione Railway CLI

- [Railway CLI Docs](https://docs.railway.com/develop/cli)
- [Railway Connect Command](https://docs.railway.com/reference/cli#connect)

