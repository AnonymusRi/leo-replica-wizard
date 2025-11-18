#!/usr/bin/env node

/**
 * Start server script for Railway
 * Starts API server that also serves static files
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import express from 'express';
import app from '../server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🚀 Starting server...`);
console.log(`   Port: ${PORT}`);
console.log(`   Host: ${HOST}`);

// Serve static files from dist/ directory
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log(`✅ Serving static files from dist/`);
} else {
  console.warn(`⚠️  dist/ directory not found. Run 'npm run build' first.`);
}

// Catch-all: serve index.html for client-side routing (must be after API routes)
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = join(distPath, 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build files not found. Run npm run build first.');
  }
});

// Server is already started in api.js, but we need to make sure it uses the right port
// The api.js file exports the app, but we need to start it here with the correct port
if (!app.listening) {
  app.listen(PORT, HOST, () => {
    console.log(`✅ Server running on http://${HOST}:${PORT}`);
    console.log(`   API: http://${HOST}:${PORT}/api`);
    console.log(`   App: http://${HOST}:${PORT}/`);
  });
}

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

