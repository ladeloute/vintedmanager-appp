#!/bin/bash
set -e

echo "🚀 Building VintedManager for production..."

# Install all dependencies including dev
npm ci

# Build the application
echo "📦 Building frontend..."
npx vite build --outDir=dist/public

echo "⚙️ Building backend..."
npx esbuild server/index.ts --bundle --platform=node --outfile=dist/server.js --external:@neondatabase/serverless --external:ws --external:./vite.js --external:vite --packages=external --format=esm --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);"

# Create uploads directory
mkdir -p uploads

# Clean dev dependencies for production
npm prune --production

echo "✅ Build completed successfully!"