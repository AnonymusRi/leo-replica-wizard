// PostgreSQL Database Configuration for Server
// This file re-exports from server/database.js for Node.js server use
// When running in Node.js, this file is used instead of database.ts

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate absolute path to server/database.js from this file's location
// src/config/database.js -> ../../server/database.js
const serverDbPath = join(__dirname, '../../server/database.js');

// Use dynamic import to handle the path correctly
const serverDb = await import(serverDbPath);

export const { query, getClient, pool } = serverDb;
export default serverDb.default;

