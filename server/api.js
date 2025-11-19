// Backend API per gestire le richieste al database PostgreSQL
// Questo server gestisce le richieste dal client e esegue le query SQL

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import database functions from server database.js
import { query } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase body size limit to 50MB for bulk inserts
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Endpoint per inserire voli
app.post('/api/flights', async (req, res) => {
  try {
    const flights = Array.isArray(req.body) ? req.body : [req.body];
    
    if (flights.length === 0) {
      return res.status(400).json({ error: 'No flights provided' });
    }

    const columns = Object.keys(flights[0]);
    const placeholders = flights.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = flights.flatMap(flight => columns.map(col => flight[col]));
    const sql = `INSERT INTO flights (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    const result = await query(sql, values);
    
    res.json({ 
      data: result.rows, 
      count: result.rowCount,
      message: `Inserted ${result.rowCount} flights` 
    });
  } catch (error) {
    console.error('Error inserting flights:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint per inserire record manutenzione
app.post('/api/maintenance-records', async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    
    if (records.length === 0) {
      return res.status(400).json({ error: 'No maintenance records provided' });
    }

    const columns = Object.keys(records[0]);
    const placeholders = records.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = records.flatMap(record => columns.map(col => record[col]));
    const sql = `INSERT INTO maintenance_records (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    const result = await query(sql, values);
    
    res.json({ 
      data: result.rows, 
      count: result.rowCount,
      message: `Inserted ${result.rowCount} maintenance records` 
    });
  } catch (error) {
    console.error('Error inserting maintenance records:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint per inserire record consumo olio
app.post('/api/oil-consumption', async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    
    if (records.length === 0) {
      return res.status(400).json({ error: 'No oil consumption records provided' });
    }

    const columns = Object.keys(records[0]);
    const placeholders = records.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = records.flatMap(record => columns.map(col => record[col]));
    const sql = `INSERT INTO oil_consumption_records (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    const result = await query(sql, values);
    
    res.json({ 
      data: result.rows, 
      count: result.rowCount,
      message: `Inserted ${result.rowCount} oil consumption records` 
    });
  } catch (error) {
    console.error('Error inserting oil consumption records:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint generico per query SELECT
app.post('/api/query', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;
    
    if (!sql) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // Solo query SELECT sono permesse per sicurezza
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return res.status(403).json({ error: 'Only SELECT queries are allowed' });
    }

    const result = await query(sql, params);
    
    res.json({ 
      data: result.rows, 
      count: result.rowCount 
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint generico per INSERT (per tabelle non specifiche)
app.post('/api/insert', async (req, res) => {
  try {
    const { table, data } = req.body;
    
    if (!table || !data) {
      return res.status(400).json({ error: 'Table name and data are required' });
    }

    const records = Array.isArray(data) ? data : [data];
    
    if (records.length === 0) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const columns = Object.keys(records[0]);
    const placeholders = records.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = records.flatMap(record => columns.map(col => record[col]));
    
    // Sanitize table name to prevent SQL injection
    const sanitizedTable = table.replace(/[^a-zA-Z0-9_]/g, '');
    if (sanitizedTable !== table) {
      return res.status(400).json({ error: 'Invalid table name' });
    }
    
    const sql = `INSERT INTO ${sanitizedTable} (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    console.log(`📝 Inserting into ${sanitizedTable}: ${records.length} records`);
    console.log(`   Columns: ${columns.join(', ')}`);
    
    const result = await query(sql, values);
    
    res.json({ 
      data: result.rows, 
      count: result.rowCount,
      message: `Inserted ${result.rowCount} records into ${sanitizedTable}` 
    });
  } catch (error) {
    console.error(`❌ Error inserting into ${req.body?.table || 'unknown table'}:`, error.message);
    console.error('   Error code:', error.code);
    console.error('   SQL state:', error.code);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint generico per DELETE (per cancellare dati)
app.delete('/api/delete', async (req, res) => {
  try {
    const { table, ids } = req.body;
    
    if (!table || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Table name and array of IDs are required' });
    }

    // Sanitize table name to prevent SQL injection
    const sanitizedTable = table.replace(/[^a-zA-Z0-9_]/g, '');
    if (sanitizedTable !== table) {
      return res.status(400).json({ error: 'Invalid table name' });
    }
    
    // Delete in batches to avoid SQL parameter limits
    const BATCH_SIZE = 1000;
    let totalDeleted = 0;
    
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map((_, idx) => `$${idx + 1}`).join(', ');
      const sql = `DELETE FROM ${sanitizedTable} WHERE id IN (${placeholders})`;
      
      const result = await query(sql, batch);
      totalDeleted += result.rowCount || 0;
    }
    
    console.log(`🗑️  Deleted ${totalDeleted} records from ${sanitizedTable}`);
    
    res.json({ 
      count: totalDeleted,
      message: `Deleted ${totalDeleted} records from ${sanitizedTable}` 
    });
  } catch (error) {
    console.error(`❌ Error deleting from ${req.body?.table || 'unknown table'}:`, error.message);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

export default app;

// Non avviare il server qui - sarà avviato da start-server-with-api.js
// Questo permette di configurare correttamente la porta e servire file statici

