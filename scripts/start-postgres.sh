#!/bin/bash
# Script per avviare PostgreSQL quando il volume è montato sul servizio Application

set -e

PGDATA=${PGDATA:-/var/lib/postgresql/data}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-railway}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-railway_auto_generated}

echo "🐘 Starting PostgreSQL..."

# Inizializza il database se non esiste
if [ ! -d "$PGDATA/pgdata" ] && [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "📦 Initializing PostgreSQL database..."
    mkdir -p "$PGDATA"
    chmod 700 "$PGDATA"
    
    # Inizializza il database
    initdb -D "$PGDATA" --encoding=UTF8 --locale=C
    
    # Avvia PostgreSQL in background per configurazione
    pg_ctl -D "$PGDATA" -o "-c listen_addresses='localhost'" -w start
    
    # Crea database e utente
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        ALTER USER "$POSTGRES_USER" WITH PASSWORD '$POSTGRES_PASSWORD';
        CREATE DATABASE "$POSTGRES_DB";
EOSQL
    
    # Ferma PostgreSQL
    pg_ctl -D "$PGDATA" -m fast stop
fi

# Avvia PostgreSQL in background
echo "🚀 Starting PostgreSQL server..."
pg_ctl -D "$PGDATA" -o "-c listen_addresses='*' -c port=5432" -l "$PGDATA/postgres.log" start

# Attendi che PostgreSQL sia pronto
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
    sleep 1
done

echo "✅ PostgreSQL is ready!"

# Mantieni lo script in esecuzione
tail -f "$PGDATA/postgres.log"

