# 📚 Railway Official Documentation - PostgreSQL Best Practices

## ✅ Best Practices dalla Documentazione Ufficiale Railway

### 1. Variabili Automatiche di Railway

Railway fornisce **automaticamente** queste variabili per il servizio PostgreSQL:
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`

**IMPORTANTE**: Railway gestisce queste variabili automaticamente. Non serve configurarle manualmente nel servizio PostgreSQL.

### 2. Variabili di Riferimento tra Servizi

Nel servizio **Application**, usa variabili di riferimento per collegarti al servizio PostgreSQL:

```bash
DATABASE_URL=${{postgres.DATABASE_URL}}
PGHOST=${{postgres.PGHOST}}
PGPORT=${{postgres.PGPORT}}
PGUSER=${{postgres.PGUSER}}
PGPASSWORD=${{postgres.PGPASSWORD}}
PGDATABASE=${{postgres.PGDATABASE}}
```

**Sintassi**: `${{ServiceName.VariableName}}`
- `postgres` = nome del servizio PostgreSQL
- Railway risolve automaticamente questi valori

### 3. Rete Privata (Consigliata)

Railway consiglia di usare la **rete privata** per la comunicazione tra servizi:
- Più veloce
- Nessun costo di egress
- Più sicuro

Le variabili `${{postgres.DATABASE_URL}}` usano automaticamente la rete privata.

### 4. Configurazione Servizio PostgreSQL

Nel servizio PostgreSQL stesso, Railway gestisce automaticamente:
- `POSTGRES_PASSWORD` (se necessario per inizializzazione)
- `POSTGRES_USER` (default: postgres)
- `POSTGRES_DB` (default: railway)

**NON serve configurare manualmente**:
- `PGHOST` (Railway lo gestisce)
- `PGPORT` (Railway lo gestisce)
- `PGDATABASE`, `PGUSER`, `PGPASSWORD` (variabili client, non server)

### 5. Connection String

Railway fornisce `DATABASE_URL` che include tutte le informazioni di connessione:
```
postgresql://user:password@host:port/database
```

Usa `DATABASE_URL` quando possibile - è la variabile più semplice e completa.

## 🎯 Configurazione Corretta

### Servizio PostgreSQL
**Variabili MINIME** (solo se necessario per inizializzazione):
```bash
POSTGRES_PASSWORD=your_password
POSTGRES_USER=postgres
POSTGRES_DB=railway
```

**NON aggiungere**: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (sono variabili client, non server)

### Servizio Application
**Usa variabili di riferimento**:
```bash
DATABASE_URL=${{postgres.DATABASE_URL}}
PGHOST=${{postgres.PGHOST}}
PGPORT=${{postgres.PGPORT}}
PGDATABASE=${{postgres.PGDATABASE}}
PGUSER=${{postgres.PGUSER}}
PGPASSWORD=${{postgres.PGPASSWORD}}
```

Railway risolve automaticamente questi valori con le credenziali corrette.

## 📖 Fonti

- [Railway Best Practices](https://docs.railway.com/overview/best-practices)
- [Railway PostgreSQL Guide](https://docs.railway.com/guides/postgresql)
- [Railway Service References](https://docs.railway.com/reference/variables)

