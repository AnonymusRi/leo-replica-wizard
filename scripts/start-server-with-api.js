#!/usr/bin/env node

/**
 * Start server script for Railway
 * Starts API server that also serves static files
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import express from 'express';

console.log('📦 Loading dependencies...');

let app;

try {
  const apiModule = await import('../server/api.js');
  app = apiModule.default;
  console.log('✅ API module loaded');
} catch (error) {
  console.error('❌ Failed to load API module:', error);
  console.error('   Error details:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🚀 Starting server...`);
console.log(`   Port: ${PORT}`);
console.log(`   Host: ${HOST}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);

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

// Test database connection before starting server
console.log('🔌 Testing database connection...');
try {
  const { query } = await import('../server/database.js');
  await query('SELECT 1 as test');
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  console.error('   This might be OK if the database is still initializing...');
  // Don't exit - let the server start anyway, it will retry on first request
}

// Start the server
console.log('🌐 Starting HTTP server...');
let server;
try {
  server = app.listen(PORT, HOST, () => {
    console.log(`✅ Server running on http://${HOST}:${PORT}`);
    console.log(`   API: http://${HOST}:${PORT}/api`);
    console.log(`   App: http://${HOST}:${PORT}/`);
    console.log(`   Health: http://${HOST}:${PORT}/api/health`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  console.error('   Error details:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}

// Handle errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  console.error('   Code:', error.code);
  console.error('   Message:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error('   Port is already in use!');
  }
  process.exit(1);
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
