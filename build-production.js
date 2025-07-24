#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building VintedManager for production...');

try {
  // 1. Build frontend avec Vite
  console.log('📦 Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // 2. Build backend avec esbuild (exclure complètement Vite)
  console.log('⚙️ Building backend...');
  execSync(`npx esbuild server/index.ts --bundle --platform=node --outfile=dist/server.js --external:@neondatabase/serverless --external:ws --external:./vite.js --external:vite --external:lightningcss --external:@babel/preset-typescript --packages=external --format=esm --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);"`, { stdio: 'inherit' });

  // 3. Créer le dossier uploads si nécessaire
  const uploadsDir = 'uploads';
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }

  // 4. Copier les assets statiques
  const staticAssets = ['dist', 'uploads'];
  console.log('✅ Production build completed successfully!');
  console.log('📋 Files generated:');
  staticAssets.forEach(asset => {
    if (fs.existsSync(asset)) {
      console.log(`   ✓ ${asset}/`);
    }
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}