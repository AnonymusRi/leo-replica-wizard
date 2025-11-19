#!/bin/bash
# Script per eseguire lo schema del database usando Railway CLI
# Questo script usa railway connect per connettersi al database

set -e

echo "🚀 Setting up database schema using Railway CLI..."

# Verifica che Railway CLI sia installato
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI non è installato!"
    echo "   Installa con: npm install -g @railway/cli"
    exit 1
fi

# Verifica che siamo loggati
if ! railway whoami &> /dev/null; then
    echo "❌ Non sei loggato in Railway CLI!"
    echo "   Esegui: railway login"
    exit 1
fi

echo "✅ Railway CLI trovato"

# Esegui lo schema usando psql tramite Railway CLI
echo "📦 Eseguendo schema del database..."
railway connect postgres < database_schema.sql

echo "✅ Schema del database eseguito con successo!"

