# 🔐 Credenziali Database PostgreSQL

## 📋 Credenziali del Servizio PostgreSQL

**⚠️ IMPORTANTE**: Queste credenziali sono gestite automaticamente da Railway tramite le variabili `${{postgres.*}}`. Non è necessario hardcodarle nei file di configurazione.

### Credenziali Attuali

```
Username: postgres
Password: vbhdKvSPFYkTySnfEqXjLCJibVJygGDm
```

## ✅ Configurazione Automatica

Railway risolve automaticamente queste variabili nel servizio Application:

```
PGUSER=${{postgres.PGUSER}}          → postgres
PGPASSWORD=${{postgres.PGPASSWORD}}  → vbhdKvSPFYkTySnfEqXjLCJibVJygGDm
PGHOST=${{postgres.PGHOST}}          → postgres.railway.internal
PGDATABASE=${{postgres.PGDATABASE}}  → railway (o il nome del database)
```

## 🔧 Se Devi Usare le Credenziali Manualmente

Se per qualche motivo devi usare le credenziali manualmente (es. per test locali o connessioni esterne), puoi usarle così:

### Connection String

```
postgresql://postgres:vbhdKvSPFYkTySnfEqXjLCJibVJygGDm@postgres.railway.internal:5432/railway
```

### Variabili Individuali

```
PGUSER=postgres
PGPASSWORD=vbhdKvSPFYkTySnfEqXjLCJibVJygGDm
PGHOST=postgres.railway.internal
PGPORT=5432
PGDATABASE=railway
```

## ⚠️ Sicurezza

- **NON committare** questo file nel repository Git
- **NON condividere** queste credenziali pubblicamente
- Railway gestisce automaticamente le credenziali, quindi non è necessario hardcodarle
- Se le credenziali cambiano, Railway aggiorna automaticamente le variabili `${{postgres.*}}`

## 📝 Note

- Le credenziali sono valide solo per il servizio PostgreSQL su Railway
- Per connessioni locali, usa le credenziali del tuo database locale
- Railway fornisce anche `DATABASE_PRIVATE_URL` che include già tutte le credenziali

