#!/usr/bin/env node
/**
 * Database Setup Script usando connection string diretta
 * Usa la connection string pubblica di Railway
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection string pubblica Railway
const DATABASE_URL = 'postgresql://postgres:vbhdKvSPFYkTySnfEqXjLCJibVJygGDm@metro.proxy.rlwy.net:53187/railway';

console.log('🔌 Connessione al database Railway...');
console.log('   Host: metro.proxy.rlwy.net:53187');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Split SQL file into individual statements - use the same logic as setup-db.js
function splitSQLStatements(sql) {
  const statements = [];
  let currentStatement = '';
  let dollarQuote = null;
  
  // Process character by character to handle dollar quotes correctly
  let i = 0;
  while (i < sql.length) {
    const char = sql[i];
    
    // Check for dollar quote start: $tag$ or $$
    if (char === '$' && dollarQuote === null) {
      let j = i + 1;
      let tag = '$';
      
      // Read the tag
      while (j < sql.length && sql[j] !== '$') {
        tag += sql[j];
        j++;
      }
      
      if (j < sql.length && sql[j] === '$') {
        tag += '$';
        dollarQuote = tag;
        currentStatement += tag;
        i = j + 1;
        continue;
      }
    }
    
    // Check for dollar quote end
    if (dollarQuote !== null && char === '$') {
      let j = i;
      let potentialEnd = '';
      
      // Check if this matches our dollar quote
      while (j < sql.length && j < i + dollarQuote.length) {
        potentialEnd += sql[j];
        j++;
      }
      
      if (potentialEnd === dollarQuote) {
        dollarQuote = null;
        currentStatement += potentialEnd;
        i = j;
        continue;
      }
    }
    
    currentStatement += char;
    
    // Check for statement end (semicolon outside dollar quotes)
    if (char === ';' && dollarQuote === null) {
      const statement = currentStatement.trim();
      if (statement && !statement.match(/^\s*--/)) {
        statements.push(statement);
      }
      currentStatement = '';
    }
    
    i++;
  }
  
  // Add any remaining statement
  if (currentStatement.trim() && !currentStatement.trim().match(/^\s*--/)) {
    statements.push(currentStatement.trim());
  }
  
  return statements.filter(s => s.length > 0 && !s.match(/^\s*--/));
}

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('✅ Connesso al database!');
    console.log('📦 Eseguendo schema del database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual statements
    const statements = splitSQLStatements(schema);
    
    console.log(`📝 Trovate ${statements.length} statement SQL totali...`);
    
    // Debug: mostra le prime statement per verificare il parsing
    console.log('\n🔍 Verifica parsing (prime 3 statement):');
    statements.slice(0, 3).forEach((stmt, idx) => {
      const preview = stmt.trim().substring(0, 80).replace(/\n/g, ' ');
      console.log(`   ${idx + 1}. ${preview}...`);
    });
    
    // First, ensure the update_updated_at_column function exists
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      console.log('✅ Funzione update_updated_at_column creata/aggiornata');
    } catch (error) {
      console.warn('⚠️  Warning creando funzione:', error.message);
    }
    
    // Separate statements by type
    const createTables = [];
    const createIndexes = [];
    const createTriggers = [];
    const createFunctions = [];
    const createTypes = [];
    const otherStatements = [];
    
    for (const statement of statements) {
      const upper = statement.trim().toUpperCase();
      if (upper.startsWith('CREATE TABLE')) {
        createTables.push(statement);
      } else if (upper.startsWith('CREATE INDEX') || upper.startsWith('CREATE UNIQUE INDEX')) {
        createIndexes.push(statement);
      } else if (upper.startsWith('CREATE TRIGGER')) {
        createTriggers.push(statement);
      } else if (upper.startsWith('CREATE FUNCTION') || upper.startsWith('CREATE OR REPLACE FUNCTION')) {
        createFunctions.push(statement);
      } else if (upper.startsWith('CREATE TYPE')) {
        createTypes.push(statement);
      } else {
        otherStatements.push(statement);
      }
    }
    
    console.log(`📋 Organizzate le statement:`);
    console.log(`   - Types: ${createTypes.length}`);
    console.log(`   - Tables: ${createTables.length}`);
    console.log(`   - Indexes: ${createIndexes.length}`);
    console.log(`   - Triggers: ${createTriggers.length}`);
    console.log(`   - Functions: ${createFunctions.length}`);
    console.log(`   - Other: ${otherStatements.length}`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Execute in order: Types -> Functions -> Tables -> Indexes -> Triggers -> Other
    const executeStatements = async (statements, type) => {
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        try {
          await client.query(statement);
          successCount++;
          if (i < 3 || i % 10 === 0) {
            console.log(`✅ ${type} ${i + 1}/${statements.length} eseguito`);
          }
        } catch (error) {
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.code === '42P07' || 
              error.code === '42710') {
            skipCount++;
            if (i < 3) {
              console.log(`ℹ️  Skipping (already exists): ${statement.substring(0, 50)}...`);
            }
          } else {
            errorCount++;
            if (errorCount <= 10) {
              console.warn(`⚠️  Warning ${type} ${i + 1}: ${error.message.substring(0, 100)}`);
            }
          }
        }
      }
    };
    
    console.log('\n📦 Eseguendo Types...');
    await executeStatements(createTypes, 'Type');
    
    console.log('\n📦 Eseguendo Functions...');
    await executeStatements(createFunctions, 'Function');
    
    console.log('\n📦 Eseguendo Tables...');
    await executeStatements(createTables, 'Table');
    
    console.log('\n📦 Eseguendo Indexes...');
    await executeStatements(createIndexes, 'Index');
    
    console.log('\n📦 Eseguendo Triggers...');
    await executeStatements(createTriggers, 'Trigger');
    
    console.log('\n📦 Eseguendo Other statements...');
    await executeStatements(otherStatements, 'Other');
    
    console.log('\n✅ Schema del database eseguito!');
    console.log(`   ✓ Eseguiti: ${successCount}`);
    console.log(`   ℹ️  Saltati (già esistenti): ${skipCount}`);
    if (errorCount > 0) {
      console.log(`   ⚠️  Errori: ${errorCount}`);
    }
    
    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`\n📊 Trovate ${result.rows.length} tabelle nel database:`);
    if (result.rows.length > 0) {
      result.rows.slice(0, 15).forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      if (result.rows.length > 15) {
        console.log(`   ... e altre ${result.rows.length - 15}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Errore durante lo setup del database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

