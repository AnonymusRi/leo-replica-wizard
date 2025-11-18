// PostgreSQL Database Configuration for Server
// This file re-exports from server/database.js for Node.js server use
// When running in Node.js, this file is used instead of database.ts

// Direct re-export using relative path
// This should work because both files are in the repository root
export { query, getClient, pool } from '../../server/database.js';
export { default } from '../../server/database.js';

