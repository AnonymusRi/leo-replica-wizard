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
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'leo_replica_wizard'}`,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('📦 Setting up database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('✅ Database schema created successfully!');
    
    // Verify by checking if some tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`📊 Created ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    // If schema already exists, that's okay
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Schema already exists, skipping...');
    } else {
      console.error('❌ Error setting up database:', error.message);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

