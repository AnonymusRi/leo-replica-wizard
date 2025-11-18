# Guida alla Migrazione da Supabase a PostgreSQL

Questa guida spiega come migrare il progetto LEO Replica Wizard da Supabase a PostgreSQL.

## 📋 Indice

1. [Prerequisiti](#prerequisiti)
2. [Installazione](#installazione)
3. [Configurazione Database](#configurazione-database)
4. [Migrazione Dati](#migrazione-dati)
5. [Configurazione Applicazione](#configurazione-applicazione)
6. [Note Importanti](#note-importanti)

## 🔧 Prerequisiti

- PostgreSQL 12 o superiore installato
- Node.js 18+ e npm installati
- Accesso al database PostgreSQL (locale o remoto)

## 📦 Installazione

### 1. Installa le dipendenze

```bash
npm install
```

Questo installerà il client PostgreSQL (`pg`) al posto di Supabase.

### 2. Configura le variabili d'ambiente

Crea un file `.env` nella root del progetto basandoti su `.env.example`:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leo_replica_wizard
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# Application Configuration
NODE_ENV=development
PORT=8080
```

## 🗄️ Configurazione Database

### 1. Crea il database

Accedi a PostgreSQL e crea il database:

```sql
CREATE DATABASE leo_replica_wizard;
```

### 2. Esegui lo schema SQL

Esegui il file `database_schema.sql` per creare tutte le tabelle, enum, funzioni e trigger:

```bash
psql -U postgres -d leo_replica_wizard -f database_schema.sql
```

Oppure usando un client GUI come pgAdmin o DBeaver.

### 3. Verifica lo schema

Controlla che tutte le tabelle siano state create:

```sql
\dt
```

## 📊 Migrazione Dati

Se hai dati esistenti in Supabase, devi esportarli e importarli:

### 1. Esporta da Supabase

Usa `pg_dump` per esportare i dati da Supabase:

```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres" > supabase_backup.sql
```

### 2. Pulisci il dump (opzionale)

Potresti dover modificare il dump per rimuovere riferimenti specifici a Supabase.

### 3. Importa in PostgreSQL

```bash
psql -U postgres -d leo_replica_wizard -f supabase_backup.sql
```

## ⚙️ Configurazione Applicazione

### 1. Aggiorna le importazioni

Il codice è già configurato per usare PostgreSQL. Le importazioni esistenti continueranno a funzionare:

```typescript
import { supabase } from "@/integrations/supabase/client";
```

Internamente, questo ora usa PostgreSQL invece di Supabase.

### 2. Sistema di Autenticazione

**IMPORTANTE**: Supabase gestiva l'autenticazione. Con PostgreSQL, devi implementare il tuo sistema di autenticazione.

Opzioni consigliate:
- **JWT + bcrypt**: Sistema di autenticazione custom
- **Passport.js**: Middleware di autenticazione per Node.js
- **NextAuth.js**: Se stai usando Next.js
- **Auth0 o Firebase Auth**: Servizi di autenticazione esterni

Il file `src/integrations/postgres/client.ts` contiene placeholder per i metodi auth che devi implementare.

### 3. Storage Files

Supabase includeva storage per file. Con PostgreSQL, devi:

- Usare un servizio esterno (AWS S3, Google Cloud Storage, Azure Blob)
- Implementare storage locale
- Usare un CDN

Aggiorna i riferimenti a `file_path` nelle tabelle per puntare al tuo nuovo sistema di storage.

## 🔄 Differenze Chiave

### Query Builder

Il wrapper PostgreSQL fornisce un'API simile a Supabase, ma ci sono alcune differenze:

```typescript
// Funziona come prima
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .eq('status', 'scheduled');

// Insert
const { data, error } = await supabase.insert('flights', {
  flight_number: 'ABC123',
  departure_airport: 'LHR',
  // ...
});

// Update
const { data, error } = await supabase.update('flights', 
  { status: 'completed' },
  [{ field: 'id', value: flightId }]
);

// Delete
const { data, error } = await supabase.delete('flights', 
  [{ field: 'id', value: flightId }]
);
```

### Real-time Subscriptions

Supabase supportava real-time subscriptions. Con PostgreSQL, devi implementare:

- **WebSockets**: Per aggiornamenti in tempo reale
- **Server-Sent Events (SSE)**: Alternativa più semplice
- **Polling**: Soluzione più semplice ma meno efficiente

### Row Level Security (RLS)

Supabase aveva RLS integrato. Con PostgreSQL, devi:

- Implementare controlli di accesso nel codice applicativo
- Usare views con security definer
- Implementare middleware di autorizzazione

## 🧪 Testing

### 1. Testa la connessione

```typescript
import { query } from '@/config/database';

async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (error) {
    console.error('Connection error:', error);
  }
}
```

### 2. Testa le query

Verifica che le query principali funzionino correttamente con il nuovo database.

## 📝 Note Importanti

1. **Autenticazione**: Deve essere implementata separatamente
2. **Storage**: I file devono essere gestiti esternamente
3. **Real-time**: Le subscriptions devono essere implementate
4. **RLS**: I controlli di accesso devono essere nel codice
5. **Backup**: Configura backup regolari del database PostgreSQL
6. **Performance**: Monitora le performance e aggiungi indici se necessario

## 🚀 Deploy

Per il deploy in produzione:

1. Configura un database PostgreSQL gestito (AWS RDS, Google Cloud SQL, Azure Database)
2. Aggiorna le variabili d'ambiente con le credenziali di produzione
3. Esegui lo schema SQL sul database di produzione
4. Migra i dati se necessario
5. Configura backup automatici
6. Monitora le performance

## 🆘 Troubleshooting

### Errore di connessione

- Verifica che PostgreSQL sia in esecuzione
- Controlla le credenziali nel file `.env`
- Verifica che il database esista
- Controlla i firewall e le regole di rete

### Errori di query

- Verifica che lo schema sia stato creato correttamente
- Controlla i log del database per errori SQL
- Assicurati che i tipi di dati corrispondano

### Problemi di performance

- Aggiungi indici alle colonne usate frequentemente nelle WHERE
- Usa EXPLAIN ANALYZE per analizzare le query lente
- Considera l'uso di connection pooling

## 📚 Risorse

- [Documentazione PostgreSQL](https://www.postgresql.org/docs/)
- [Node.js pg library](https://node-postgres.com/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

