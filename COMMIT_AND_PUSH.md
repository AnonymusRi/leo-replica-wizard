# 🚀 Istruzioni per Commit e Push su GitHub

## File da committare

I seguenti file sono stati creati/modificati e devono essere aggiunti alla repository:

### Nuovi file:
- `database_schema.sql` - Schema completo PostgreSQL
- `src/config/database.ts` - Configurazione PostgreSQL
- `src/integrations/postgres/client.ts` - Client PostgreSQL wrapper
- `.env.example` - Template variabili ambiente
- `MIGRATION_GUIDE.md` - Guida migrazione
- `README_MIGRATION.md` - Riepilogo migrazione
- `USAGE_EXAMPLES.md` - Esempi utilizzo
- `COMMIT_AND_PUSH.md` - Questo file

### File modificati:
- `package.json` - Rimosso Supabase, aggiunto pg
- `src/integrations/supabase/client.ts` - Aggiornato per usare PostgreSQL

## Comandi Git

Esegui questi comandi nella directory del progetto:

```bash
# Vai nella directory del progetto
cd C:\Users\Riccardo\leo-replica-wizard

# Aggiungi tutti i file
git add .

# Oppure aggiungi file specifici:
git add database_schema.sql
git add src/config/database.ts
git add src/integrations/postgres/client.ts
git add src/integrations/supabase/client.ts
git add package.json
git add .env.example
git add MIGRATION_GUIDE.md
git add README_MIGRATION.md
git add USAGE_EXAMPLES.md

# Fai il commit
git commit -m "Migrate from Supabase to PostgreSQL

- Add complete PostgreSQL database schema
- Replace Supabase client with PostgreSQL wrapper
- Update package.json dependencies
- Add migration guide and documentation
- Maintain backward compatibility with existing code"

# Push su GitHub
git push origin main
```

## Se la repository non è ancora inizializzata:

```bash
# Inizializza git (se non già fatto)
git init

# Aggiungi il remote
git remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git

# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "Initial commit: Migrate from Supabase to PostgreSQL"

# Push (potrebbe richiedere autenticazione)
git push -u origin main
```

## Se hai problemi con l'autenticazione:

1. Usa GitHub CLI: `gh auth login`
2. Oppure usa un Personal Access Token invece della password
3. Oppure configura SSH keys

