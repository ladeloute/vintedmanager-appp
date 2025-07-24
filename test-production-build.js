#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🧪 Testing production build...');

try {
  // Test du build
  console.log('1. Testing build process...');
  execSync('node build-production.js', { stdio: 'inherit' });
  
  // Vérifier que les fichiers sont créés
  const requiredFiles = ['dist/server.js', 'dist/public/index.html'];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
    console.log(`✅ Found: ${file}`);
  }
  
  console.log('🎉 Production build test passed!');
  console.log('📋 Ready for deployment on Railway or Render');
  
} catch (error) {
  console.error('❌ Production build test failed:', error.message);
  process.exit(1);
}