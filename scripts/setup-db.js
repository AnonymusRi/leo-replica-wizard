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
const dbConfig = {
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || 'leo_replica_wizard',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
};

// Use DATABASE_URL if available (Railway provides this)
if (process.env.DATABASE_URL) {
  dbConfig.connectionString = process.env.DATABASE_URL;
}

// SSL configuration
if (process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('sslmode=require')) {
  dbConfig.ssl = { rejectUnauthorized: false };
} else {
  dbConfig.ssl = false;
}

const pool = new Pool(dbConfig);

// Split SQL file into individual statements
function splitSQLStatements(sql) {
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let delimiter = ';';
  let dollarQuote = null;
  
  const lines = sql.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for dollar-quoted strings (used in functions)
    if (dollarQuote === null) {
      const dollarMatch = trimmed.match(/^\$\$([^$]*)\$$/);
      if (dollarMatch) {
        dollarQuote = dollarMatch[0];
        currentStatement += line + '\n';
        continue;
      }
      
      // Check for opening dollar quote
      const openDollarMatch = trimmed.match(/^\$\$([^$]*)$/);
      if (openDollarMatch) {
        dollarQuote = openDollarMatch[0];
        currentStatement += line + '\n';
        continue;
      }
    } else {
      // Check for closing dollar quote
      if (trimmed.includes(dollarQuote)) {
        dollarQuote = null;
      }
      currentStatement += line + '\n';
      continue;
    }
    
    // Skip comments and empty lines
    if (trimmed.startsWith('--') || trimmed === '') {
      continue;
    }
    
    currentStatement += line + '\n';
    
    // Check if this is the end of a statement
    if (trimmed.endsWith(';') && dollarQuote === null) {
      const statement = currentStatement.trim();
      if (statement) {
        statements.push(statement);
      }
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
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

