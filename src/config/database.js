// PostgreSQL Database Configuration for Server
// This file re-exports from server/database.js for Node.js server use
// When running in Node.js, this file is used instead of database.ts

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// In browser, export stub functions that throw errors
// This prevents Vite from trying to bundle server-side code
export async function query() {
  if (isBrowser) {
    throw new Error('Database queries are not available in browser. Use API endpoints instead.');
  }
  // Dynamic import only in Node.js to avoid bundling pg in browser
  const { query: serverQuery } = await import('../../server/database.js');
  return serverQuery.apply(this, arguments);
}

export async function getClient() {
  if (isBrowser) {
    throw new Error('Database client is not available in browser. Use API endpoints instead.');
  }
  // Dynamic import only in Node.js to avoid bundling pg in browser
  const { getClient: serverGetClient } = await import('../../server/database.js');
  return serverGetClient.apply(this, arguments);
}

export const pool = isBrowser ? null : (async () => {
  const { pool: serverPool } = await import('../../server/database.js');
  return serverPool;
})();

export default isBrowser ? null : (async () => {
  const serverDb = await import('../../server/database.js');
  return serverDb.default;
})();

