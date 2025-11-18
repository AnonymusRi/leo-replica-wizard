#!/usr/bin/env node

/**
 * Start server script for Railway
 * Reads PORT from environment and starts Vite preview
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || '8080';
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🚀 Starting Vite preview server...`);
console.log(`   Host: ${HOST}`);
console.log(`   Port: ${PORT}`);

const vitePreview = spawn('npx', ['vite', 'preview', '--host', HOST, '--port', PORT], {
  stdio: 'inherit',
  shell: true,
  cwd: join(__dirname, '..'),
});

vitePreview.on('error', (error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});

vitePreview.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

