// PostgreSQL Database Configuration for Server
// This is a JavaScript version for Node.js server use

import pg from 'pg';
const { Pool } = pg;

let poolInstance = null;

// Initialize pool lazily
async function getPool() {
  if (!poolInstance) {
    // Database connection configuration
    // Railway private networking: use 'postgres' as hostname for internal communication
    const dbConfig = {
      host: process.env.DB_HOST || process.env.PGHOST || 'postgres' || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
      database: process.env.DB_NAME || process.env.PGDATABASE || process.env.POSTGRES_DB || 'leo_replica_wizard',
      user: process.env.DB_USER || process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    // Use DATABASE_URL if available (Railway provides this - takes precedence)
    if (process.env.DATABASE_URL) {
      dbConfig.connectionString = process.env.DATABASE_URL;
    }

    // SSL configuration - Railway requires SSL for database connections
    if (process.env.DB_SSL === 'true' || 
        process.env.DATABASE_URL?.includes('sslmode=require') ||
        process.env.DATABASE_URL?.includes('railway')) {
      dbConfig.ssl = { rejectUnauthorized: false };
    } else {
      dbConfig.ssl = false;
    }

    poolInstance = new Pool(dbConfig);

    poolInstance.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    poolInstance.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
    });
  }
  return poolInstance;
}

// Helper function to execute queries
export async function query(text, params) {
  const pool = await getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Executed query', { 
      text: text.substring(0, 100) + '...', 
      duration, 
      rows: res.rowCount 
    });
    return res;
  } catch (error) {
    console.error('❌ Query error', { text: text.substring(0, 100), error: error.message });
    throw error;
  }
}

// Helper function to get a client from the pool
export async function getClient() {
  const pool = await getPool();
  return await pool.connect();
}

// Export pool (lazy getter)
export const pool = getPool();
export default pool;

