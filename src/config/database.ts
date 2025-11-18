// PostgreSQL Database Configuration
// Replace Supabase with PostgreSQL connection
// This file should only be used server-side

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

let poolInstance: any = null;
let pgModule: any = null;

// Initialize pool lazily (only in Node.js)
async function getPool() {
  if (isBrowser) {
    throw new Error('Database pool is not available in browser environment');
  }

  if (!poolInstance) {
    // Dynamic import to avoid bundling pg in browser
    if (!pgModule) {
      pgModule = await import('pg');
    }
    const { Pool } = pgModule.default || pgModule;
    
    // Database connection configuration
    // Railway private networking: use 'postgres' as hostname for internal communication
    const dbConfig: any = {
      host: process.env.DB_HOST || process.env.PGHOST || (process.env.RAILWAY_ENVIRONMENT ? 'postgres' : 'localhost'),
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
      console.log('Connected to PostgreSQL database');
    });

    poolInstance.on('error', (err: any) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return poolInstance;
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  if (isBrowser) {
    throw new Error('Database queries are not available in browser. Use API endpoints instead.');
  }
  
  const pool = await getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
}

// Helper function to get a client from the pool
export async function getClient() {
  if (isBrowser) {
    throw new Error('Database client is not available in browser. Use API endpoints instead.');
  }
  
  const pool = await getPool();
  return await pool.connect();
}

// Export pool (lazy getter)
export const pool = isBrowser ? null : getPool();
export default pool;

