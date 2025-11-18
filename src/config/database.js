// PostgreSQL Database Configuration for Server
// This file re-exports from server/database.js for Node.js server use
// When running in Node.js, this file is used instead of database.ts

// Import from server/database.js using relative path
// This works because both files are in the repository root
export { query, getClient, pool } from '../../server/database.js';
export { default } from '../../server/database.js';

