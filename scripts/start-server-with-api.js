#!/usr/bin/env node

/**
 * Start server script for Railway
 * Starts both API server and Vite preview
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import app from '../server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || '5000';
const HOST = process.env.HOST || '0.0.0.0';
const API_PORT = parseInt(PORT);
const VITE_PORT = API_PORT + 1;

console.log(`🚀 Starting servers...`);
console.log(`   API Server: http://${HOST}:${API_PORT}`);
console.log(`   Vite Preview: http://${HOST}:${VITE_PORT}`);

// Start API server
app.listen(API_PORT, HOST, () => {
  console.log(`✅ API Server running on port ${API_PORT}`);
});

// Start Vite preview
const vitePreview = spawn('npx', ['vite', 'preview', '--host', HOST, '--port', VITE_PORT.toString()], {
  stdio: 'inherit',
  shell: true,
  cwd: join(__dirname, '..'),
  env: {
    ...process.env,
    VITE_API_URL: `http://${HOST}:${API_PORT}/api`,
  },
});

vitePreview.on('error', (error) => {
  console.error('❌ Error starting Vite preview:', error);
  process.exit(1);
});

vitePreview.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Vite preview exited with code ${code}`);
    process.exit(code);
  }
});

