# Spiegazione: Perché vengono usati Mock Data

## 🔍 Situazione Attuale

L'applicazione **Leo Replica Wizard** è una **SPA (Single Page Application)** che viene servita come **file statici** su Railway. Questo significa che:

1. **Il codice viene eseguito nel browser** (client-side)
2. **Il database PostgreSQL è lato server** (su Railway)
3. **Il browser NON può accedere direttamente al database** per motivi di sicurezza

## ⚠️ Perché i Mock Data?

### Problema
Il codice client-side (nel browser) **non può eseguire query SQL direttamente** al database PostgreSQL perché:
- Il database è su un server remoto
- Le credenziali del database non possono essere esposte nel browser
- Non c'è un backend API che gestisce le richieste

### Soluzione Attuale: Mock Data
Ho implementato **mock data** nel browser per:
- ✅ Permettere all'applicazione di funzionare senza errori
- ✅ Simulare le risposte del database
- ✅ Testare l'interfaccia utente

## 🎯 Il Simulatore che hai Creato

### Dove si Trova
1. Vai alla pagina principale: `/dashboard`
2. Clicca sul modulo **"MX" (Manutenzione)**
3. Il simulatore è in cima alla pagina
4. Clicca su **"Avvia Simulazione"** per generare i dati

### Come Funziona
Il simulatore (`HelicopterSimulation`) genera:
- Voli per 5 mesi (Foggia-Tremiti ed elisoccorso)
- Record di manutenzione
- Record di consumo olio
- Assegnazioni voli

### ⚠️ Problema Attuale
Il simulatore **non funziona nel browser** perché:
- Cerca di inserire dati direttamente nel database
- Il browser non può accedere al database PostgreSQL
- Serve un **backend API** per gestire le richieste

## 🚀 Soluzione: Creare un Backend API

Per far funzionare il simulatore e usare dati reali, serve:

### Opzione 1: Backend Node.js/Express
```javascript
// Esempio: server/api/flights.js
app.post('/api/flights', async (req, res) => {
  const { data, error } = await query('INSERT INTO flights ...');
  res.json({ data, error });
});
```

### Opzione 2: Serverless Functions (Railway)
- Creare endpoint API che gestiscono le richieste al database
- Il client fa chiamate HTTP a questi endpoint
- Gli endpoint eseguono le query SQL

### Opzione 3: Supabase Client SDK
- Usare Supabase che ha già un backend API integrato
- Il client SDK fa chiamate HTTP all'API di Supabase
- Supabase gestisce le query al database

## 📝 Cosa Fare Ora

### Per Testare con Dati Reali (Temporaneo)
1. Crea un backend API semplice (Node.js/Express)
2. Esponi endpoint REST per:
   - `GET /api/flights` - Leggere voli
   - `POST /api/flights` - Creare voli
   - `GET /api/crew` - Leggere crew
   - etc.

### Per Usare il Simulatore
1. Il simulatore deve chiamare gli endpoint API invece di `supabase.from()`
2. Gli endpoint API eseguono le query SQL al database
3. I dati vengono restituiti al client

## 🔧 Modifiche Necessarie

### Nel Client (Browser)
```typescript
// Invece di:
await supabase.from('flights').insert(data);

// Usa:
await fetch('/api/flights', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Nel Backend (Server)
```typescript
// server/api/flights.ts
app.post('/api/flights', async (req, res) => {
  const result = await query('INSERT INTO flights ...', [data]);
  res.json(result);
});
```

## ✅ Conclusione

- **Mock data**: Necessari per far funzionare l'app nel browser senza backend
- **Simulatore**: Funziona solo con un backend API
- **Dati reali**: Richiedono un backend API che gestisce le query al database

Vuoi che ti aiuti a creare un backend API semplice per far funzionare il simulatore?

