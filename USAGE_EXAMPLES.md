# Esempi di Utilizzo - PostgreSQL Client

Questo documento mostra come usare il client PostgreSQL che sostituisce Supabase.

## 📚 Indice

1. [Query Base](#query-base)
2. [Insert](#insert)
3. [Update](#update)
4. [Delete](#delete)
5. [Query Complesse](#query-complesse)
6. [Gestione Errori](#gestione-errori)

## 🔍 Query Base

### Select semplice

```typescript
import { supabase } from "@/integrations/supabase/client";

// Seleziona tutti i voli
const { data, error } = await supabase
  .from('flights')
  .select('*');

if (error) {
  console.error('Error:', error);
} else {
  console.log('Flights:', data);
}
```

### Select con filtri

```typescript
// Voli con status 'scheduled'
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .eq('status', 'scheduled');

// Voli con più condizioni
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .eq('status', 'scheduled')
  .gte('departure_time', new Date().toISOString());

// Voli con LIKE
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .ilike('flight_number', 'ABC%');
```

### Select con ordinamento e limiti

```typescript
// Ordina per data di partenza
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .order('departure_time', { ascending: true })
  .limit(10);

// Paginazione
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .range(0, 9); // Primi 10 risultati
```

## ➕ Insert

### Insert singolo record

```typescript
const { data, error } = await supabase.insert('flights', {
  flight_number: 'ABC123',
  departure_airport: 'LHR',
  arrival_airport: 'JFK',
  departure_time: '2024-01-15T10:00:00Z',
  arrival_time: '2024-01-15T18:00:00Z',
  status: 'scheduled',
  organization_id: 'org-uuid-here',
});

if (error) {
  console.error('Error creating flight:', error);
} else {
  console.log('Flight created:', data);
}
```

### Insert multipli record

```typescript
const { data, error } = await supabase.insert('flights', [
  {
    flight_number: 'ABC123',
    departure_airport: 'LHR',
    arrival_airport: 'JFK',
    // ...
  },
  {
    flight_number: 'DEF456',
    departure_airport: 'JFK',
    arrival_airport: 'LHR',
    // ...
  },
]);
```

## ✏️ Update

```typescript
// Aggiorna un volo
const { data, error } = await supabase.update(
  'flights',
  { status: 'completed' },
  [{ field: 'id', value: flightId }]
);

// Aggiorna con più condizioni
const { data, error } = await supabase.update(
  'flights',
  { status: 'cancelled', notes: 'Weather conditions' },
  [
    { field: 'id', value: flightId },
    { field: 'status', value: 'scheduled' }
  ]
);
```

## 🗑️ Delete

```typescript
// Elimina un volo
const { data, error } = await supabase.delete(
  'flights',
  [{ field: 'id', value: flightId }]
);

// Elimina con più condizioni
const { data, error } = await supabase.delete(
  'flights',
  [
    { field: 'status', value: 'cancelled' },
    { field: 'departure_time', value: '2024-01-01' }
  ]
);
```

## 🔗 Query Complesse

### Join (usando query dirette)

Per query complesse con JOIN, usa direttamente il metodo `query`:

```typescript
import { query } from '@/config/database';

const result = await query(`
  SELECT 
    f.*,
    a.tail_number,
    c.company_name
  FROM flights f
  LEFT JOIN aircraft a ON f.aircraft_id = a.id
  LEFT JOIN clients c ON f.client_id = c.id
  WHERE f.status = $1
  ORDER BY f.departure_time
`, ['scheduled']);

console.log('Flights with details:', result.rows);
```

### Query con aggregazioni

```typescript
const result = await query(`
  SELECT 
    status,
    COUNT(*) as count,
    AVG(passenger_count) as avg_passengers
  FROM flights
  WHERE organization_id = $1
  GROUP BY status
`, [organizationId]);

console.log('Flight statistics:', result.rows);
```

### Transazioni

```typescript
import { getClient } from '@/config/database';

const client = await getClient();

try {
  await client.query('BEGIN');
  
  // Prima operazione
  await client.query(
    'INSERT INTO flights (...) VALUES (...)',
    [...]
  );
  
  // Seconda operazione
  await client.query(
    'UPDATE aircraft SET status = $1 WHERE id = $2',
    ['in_use', aircraftId]
  );
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## ⚠️ Gestione Errori

### Pattern standard

```typescript
const { data, error } = await supabase
  .from('flights')
  .select('*')
  .eq('id', flightId);

if (error) {
  console.error('Database error:', error.message);
  console.error('Error code:', error.code);
  // Gestisci l'errore
  return;
}

// Usa i dati
console.log('Flight:', data);
```

### Try-catch per query dirette

```typescript
import { query } from '@/config/database';

try {
  const result = await query('SELECT * FROM flights WHERE id = $1', [flightId]);
  console.log('Flight:', result.rows[0]);
} catch (error: any) {
  console.error('Query error:', error.message);
  // Gestisci l'errore
}
```

## 🔐 Autenticazione

**NOTA**: L'autenticazione deve essere implementata separatamente. Ecco un esempio base:

```typescript
// Esempio di login (da implementare)
async function login(email: string, password: string) {
  // 1. Verifica credenziali nel database
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    return { error: 'Invalid credentials' };
  }
  
  // 2. Verifica password (usa bcrypt)
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    return { error: 'Invalid credentials' };
  }
  
  // 3. Crea sessione/JWT
  const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET!);
  
  return { data: { user: data, token } };
}
```

## 📊 Esempi Pratici

### Ottenere voli di un'organizzazione

```typescript
async function getOrganizationFlights(orgId: string) {
  const { data, error } = await supabase
    .from('flights')
    .select(`
      *,
      aircraft:aircraft_id (
        tail_number,
        model
      ),
      client:client_id (
        company_name
      )
    `)
    .eq('organization_id', orgId)
    .order('departure_time', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch flights: ${error.message}`);
  }
  
  return data;
}
```

### Creare un volo con crew

```typescript
async function createFlightWithCrew(flightData: any, crewIds: string[]) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Crea il volo
    const flightResult = await client.query(
      `INSERT INTO flights (
        flight_number, departure_airport, arrival_airport,
        departure_time, arrival_time, organization_id
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        flightData.flight_number,
        flightData.departure_airport,
        flightData.arrival_airport,
        flightData.departure_time,
        flightData.arrival_time,
        flightData.organization_id
      ]
    );
    
    const flightId = flightResult.rows[0].id;
    
    // Assegna il crew
    for (const crewId of crewIds) {
      await client.query(
        `INSERT INTO flight_crew (flight_id, crew_member_id, position)
         VALUES ($1, $2, $3)`,
        [flightId, crewId, 'captain']
      );
    }
    
    await client.query('COMMIT');
    return { data: { id: flightId }, error: null };
  } catch (error: any) {
    await client.query('ROLLBACK');
    return { data: null, error: { message: error.message } };
  } finally {
    client.release();
  }
}
```

## 🚀 Best Practices

1. **Usa parametri**: Sempre usa parametri nelle query per prevenire SQL injection
2. **Gestisci errori**: Controlla sempre `error` nelle risposte
3. **Transazioni**: Usa transazioni per operazioni multiple correlate
4. **Connection Pooling**: Il pool è già configurato, non creare nuove connessioni manualmente
5. **Indici**: Assicurati che le colonne usate frequentemente nelle WHERE abbiano indici

## 📝 Note

- Il wrapper PostgreSQL mantiene la stessa API di Supabase per facilitare la migrazione
- Per query complesse, usa direttamente `query()` o `getClient()`
- L'autenticazione e lo storage devono essere implementati separatamente

