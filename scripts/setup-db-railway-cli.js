#!/usr/bin/env node
/**
 * Database Setup Script usando Railway CLI
 * Questo script usa railway connect per connettersi al database
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verifica che Railway CLI sia installato
try {
  execSync('railway --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Railway CLI non è installato!');
  console.error('   Installa con: npm install -g @railway/cli');
  process.exit(1);
}

// Verifica che siamo loggati
try {
  execSync('railway whoami', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Non sei loggato in Railway CLI!');
  console.error('   Esegui: railway login');
  process.exit(1);
}

console.log('✅ Railway CLI trovato e autenticato');

// Leggi lo schema
const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ File schema non trovato: ${schemaPath}`);
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('📦 Eseguendo schema del database tramite Railway CLI...');
console.log('   Questo potrebbe richiedere alcuni minuti...');

try {
  // Usa railway connect per eseguire lo schema
  execSync('railway connect postgres', {
    input: schema,
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ Schema del database eseguito con successo!');
} catch (error) {
  console.error('❌ Errore durante l\'esecuzione dello schema:');
  console.error(error.message);
  process.exit(1);
}

