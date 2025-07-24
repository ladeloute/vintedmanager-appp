#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building VintedManager for Vercel...');

try {
  // 1. Build frontend avec vite
  console.log('📦 Building frontend...');
  execSync('npx vite build --outDir=dist/public', { stdio: 'inherit' });

  // 2. Créer les API routes pour Vercel
  console.log('⚙️ Creating Vercel API routes...');
  
  if (!fs.existsSync('api')) {
    fs.mkdirSync('api', { recursive: true });
  }

  // Créer le handler principal
  const serverlessHandler = `
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enregistrer les routes
registerRoutes(app);

export default app;
`;

  fs.writeFileSync('api/index.js', serverlessHandler);

  // 3. Créer le dossier uploads
  const uploadsDir = 'uploads';
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }

  console.log('✅ Vercel build completed successfully!');

} catch (error) {
  console.error('❌ Vercel build failed:', error.message);
  process.exit(1);
}