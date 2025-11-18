#!/usr/bin/env node
/**
 * Database Setup Script for Railway with explicit credentials
 * This script sets up the PostgreSQL database schema using Railway credentials
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Railway PostgreSQL credentials
const dbConfig = {
  host: process.env.PGHOST || process.env.RAILWAY_PRIVATE_DOMAIN || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || process.env.POSTGRES_DB || 'railway',
  user: process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '',
  ssl: {
    rejectUnauthorized: false
  }
};

// Use DATABASE_URL if available (takes precedence)
if (process.env.DATABASE_URL) {
  dbConfig.connectionString = process.env.DATABASE_URL;
  // Railway DATABASE_URL includes SSL, so enable it
  dbConfig.ssl = { rejectUnauthorized: false };
}

console.log('🔌 Connecting to database...');
console.log(`   Host: ${dbConfig.host || 'from DATABASE_URL'}`);
console.log(`   Database: ${dbConfig.database || 'from DATABASE_URL'}`);
console.log(`   User: ${dbConfig.user || 'from DATABASE_URL'}`);

const pool = new Pool(dbConfig);

// Split SQL file into individual statements
function splitSQLStatements(sql) {
  const statements = [];
  let currentStatement = '';
  let dollarQuote = null;
  
  // Process character by character to handle dollar quotes correctly
  let i = 0;
  while (i < sql.length) {
    const char = sql[i];
    const nextChar = i + 1 < sql.length ? sql[i + 1] : '';
    
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
    console.log('📦 Setting up database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual statements
    const statements = splitSQLStatements(schema);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue;
      }
      
      try {
        await client.query(statement);
        successCount++;
      } catch (error) {
        // Skip errors for "already exists" cases
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '42P07' || // duplicate_table
            error.code === '42710') { // duplicate_object
          skipCount++;
          if (i < 5 || i % 10 === 0) {
            console.log(`ℹ️  Skipping (already exists): ${statement.substring(0, 50)}...`);
          }
          continue;
        }
        // For other errors, log and continue
        errorCount++;
        console.warn(`⚠️  Warning executing statement ${i + 1}: ${error.message.substring(0, 100)}`);
        if (errorCount <= 5) {
          console.warn(`   Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('\n✅ Database schema setup completed!');
    console.log(`   ✓ Successfully executed: ${successCount}`);
    console.log(`   ℹ️  Skipped (already exists): ${skipCount}`);
    if (errorCount > 0) {
      console.log(`   ⚠️  Errors: ${errorCount}`);
    }
    
    // Verify by checking if some tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`\n📊 Found ${result.rows.length} tables in database:`);
    if (result.rows.length > 0) {
      result.rows.slice(0, 15).forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      if (result.rows.length > 15) {
        console.log(`   ... and ${result.rows.length - 15} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

