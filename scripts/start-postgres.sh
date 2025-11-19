#!/bin/bash
# Script per avviare PostgreSQL quando il volume è montato sul servizio Application

set -e

PGDATA=${PGDATA:-/var/lib/postgresql/data}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-railway}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-railway_auto_generated}

echo "🐘 Starting PostgreSQL..."
echo "   PGDATA: $PGDATA"
echo "   User: $POSTGRES_USER"
echo "   Database: $POSTGRES_DB"

# Crea directory se non esiste
mkdir -p "$PGDATA"
chmod 700 "$PGDATA" 2>/dev/null || true

# Trova il percorso di initdb - cerca in tutte le possibili posizioni
INITDB_PATH=$(which initdb 2>/dev/null || \
    find /usr/lib/postgresql -name initdb 2>/dev/null | head -1 || \
    find /usr -name initdb 2>/dev/null | head -1 || \
    find /usr/local -name initdb 2>/dev/null | head -1)

PG_CTL_PATH=$(which pg_ctl 2>/dev/null || \
    find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1 || \
    find /usr -name pg_ctl 2>/dev/null | head -1 || \
    find /usr/local -name pg_ctl 2>/dev/null | head -1)

PSQL_PATH=$(which psql 2>/dev/null || \
    find /usr/lib/postgresql -name psql 2>/dev/null | head -1 || \
    find /usr -name psql 2>/dev/null | head -1 || \
    find /usr/local -name psql 2>/dev/null | head -1)

PG_ISREADY_PATH=$(which pg_isready 2>/dev/null || \
    find /usr/lib/postgresql -name pg_isready 2>/dev/null | head -1 || \
    find /usr -name pg_isready 2>/dev/null | head -1 || \
    find /usr/local -name pg_isready 2>/dev/null | head -1)

if [ -z "$INITDB_PATH" ] || [ -z "$PG_CTL_PATH" ]; then
    echo "❌ PostgreSQL binaries not found!"
    echo "   INITDB: $INITDB_PATH"
    echo "   PG_CTL: $PG_CTL_PATH"
    echo "   PSQL: $PSQL_PATH"
    echo "   PG_ISREADY: $PG_ISREADY_PATH"
    echo "   PATH: $PATH"
    echo "   Searching for PostgreSQL installation..."
    find /usr -name "postgres" -type f 2>/dev/null | head -5
    echo "   Trying to install PostgreSQL..."
    apt-get update && apt-get install -y postgresql postgresql-contrib || {
        echo "❌ Failed to install PostgreSQL"
        exit 1
    }
    # Riprova a trovare i binari
    INITDB_PATH=$(which initdb || find /usr/lib/postgresql -name initdb 2>/dev/null | head -1)
    PG_CTL_PATH=$(which pg_ctl || find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1)
    PSQL_PATH=$(which psql || find /usr/lib/postgresql -name psql 2>/dev/null | head -1)
    PG_ISREADY_PATH=$(which pg_isready || find /usr/lib/postgresql -name pg_isready 2>/dev/null | head -1)
fi

echo "✅ Found PostgreSQL binaries:"
echo "   INITDB: $INITDB_PATH"
echo "   PG_CTL: $PG_CTL_PATH"
echo "   PSQL: $PSQL_PATH"
echo "   PG_ISREADY: $PG_ISREADY_PATH"

# Inizializza il database se non esiste
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "📦 Initializing PostgreSQL database..."
    
    # Inizializza il database
    "$INITDB_PATH" -D "$PGDATA" --encoding=UTF8 --locale=C -U "$POSTGRES_USER" || {
        echo "⚠️  initdb failed, trying with existing data..."
    }
    
    # Configura PostgreSQL per accettare connessioni
    echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
    echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
    echo "port = 5432" >> "$PGDATA/postgresql.conf"
    
    # Avvia PostgreSQL per configurazione iniziale
    "$PG_CTL_PATH" -D "$PGDATA" -o "-c listen_addresses='*' -c port=5432" -l "$PGDATA/postgres.log" start || {
        echo "⚠️  Failed to start PostgreSQL for initial setup"
    }
    
    # Attendi che PostgreSQL sia pronto (usa localhost per connessioni interne al container)
    sleep 3
    until "$PG_ISREADY_PATH" -h localhost -p 5432 -U "$POSTGRES_USER" 2>/dev/null; do
        echo "⏳ Waiting for PostgreSQL to be ready for setup..."
        sleep 1
    done
    
    # Crea database se non esiste (usa localhost per connessioni interne al container)
    "$PSQL_PATH" -h localhost -p 5432 -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE $POSTGRES_DB;" 2>/dev/null || {
        echo "ℹ️  Database $POSTGRES_DB might already exist"
    }
    
    # Imposta password (usa localhost per connessioni interne al container)
    "$PSQL_PATH" -h localhost -p 5432 -U "$POSTGRES_USER" -d postgres -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" 2>/dev/null || {
        echo "⚠️  Failed to set password"
    }
    
    # Ferma PostgreSQL per riavviarlo con la configurazione corretta
    "$PG_CTL_PATH" -D "$PGDATA" -m fast stop || {
        echo "⚠️  Failed to stop PostgreSQL"
    }
    sleep 2
fi

# Avvia PostgreSQL in background
echo "🚀 Starting PostgreSQL server..."
"$PG_CTL_PATH" -D "$PGDATA" -o "-c listen_addresses='*' -c port=5432" -l "$PGDATA/postgres.log" start || {
    echo "⚠️  PostgreSQL might already be running"
}

# Attendi che PostgreSQL sia pronto (usa localhost per verifiche interne al container)
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if "$PG_ISREADY_PATH" -h localhost -p 5432 -U "$POSTGRES_USER" 2>/dev/null; then
        echo "✅ PostgreSQL is ready on localhost:5432!"
        # Verifica anche sul hostname Railway se disponibile
        RAILWAY_HOST="${RAILWAY_SERVICE_NAME:-leo-replica-wizard}.railway.internal"
        if "$PG_ISREADY_PATH" -h "$RAILWAY_HOST" -p 5432 -U "$POSTGRES_USER" 2>/dev/null; then
            echo "✅ PostgreSQL is also accessible via Railway private network: $RAILWAY_HOST:5432"
        fi
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL failed to start after 30 attempts"
        exit 1
    fi
    sleep 1
done

# Mantieni lo script in esecuzione per tenere PostgreSQL attivo
echo "🔄 Keeping PostgreSQL running..."
tail -f "$PGDATA/postgres.log" &
wait

