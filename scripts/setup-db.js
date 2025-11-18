#!/usr/bin/env node
/**
 * Database Setup Script for Railway
 * This script sets up the PostgreSQL database schema
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database connection from environment variables
// Railway provides these variables automatically
// Railway private networking: use 'postgres' as hostname for internal communication
const dbConfig = {
  host: process.env.DB_HOST || process.env.PGHOST || process.env.RAILWAY_PRIVATE_DOMAIN || (process.env.RAILWAY_ENVIRONMENT ? 'postgres' : 'localhost'),
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || process.env.POSTGRES_DB || 'leo_replica_wizard',
  user: process.env.DB_USER || process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '',
};

// Use DATABASE_URL if available (Railway provides this - takes precedence)
if (process.env.DATABASE_URL) {
  dbConfig.connectionString = process.env.DATABASE_URL;
}

// SSL configuration - Railway requires SSL
if (process.env.DB_SSL === 'true' || 
    process.env.DATABASE_URL?.includes('sslmode=require') ||
    process.env.RAILWAY_PRIVATE_DOMAIN) {
  dbConfig.ssl = { rejectUnauthorized: false };
} else {
  dbConfig.ssl = false;
}

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
      console.log('✅ Created/updated update_updated_at_column function');
    } catch (error) {
      console.warn('⚠️  Warning creating function:', error.message);
    }
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue;
      }
      
      try {
        await client.query(statement);
      } catch (error) {
        // Skip errors for "already exists" cases
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '42P07' || // duplicate_table
            error.code === '42710') { // duplicate_object
          console.log(`ℹ️  Skipping (already exists): ${statement.substring(0, 50)}...`);
          continue;
        }
        // Skip errors for triggers that reference non-existent functions (function will be created later)
        if (error.message.includes('does not exist') && 
            (statement.includes('TRIGGER') || statement.includes('FUNCTION'))) {
          console.log(`ℹ️  Skipping (dependency not ready): ${statement.substring(0, 50)}...`);
          continue;
        }
        // Skip errors for foreign keys that reference tables not yet created
        if (error.message.includes('does not exist') && 
            (statement.includes('REFERENCES') || error.code === '42P01')) {
          console.log(`ℹ️  Skipping (table dependency not ready): ${statement.substring(0, 50)}...`);
          continue;
        }
        // For other errors, log and continue (some statements might fail if dependencies don't exist yet)
        console.warn(`⚠️  Warning executing statement ${i + 1}: ${error.message.substring(0, 100)}`);
        console.warn(`   Statement: ${statement.substring(0, 100)}...`);
      }
    }
    
    console.log('✅ Database schema setup completed!');
    
    // Verify by checking if some tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`📊 Found ${result.rows.length} tables in database:`);
    if (result.rows.length > 0) {
      result.rows.slice(0, 10).forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      if (result.rows.length > 10) {
        console.log(`   ... and ${result.rows.length - 10} more`);
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

