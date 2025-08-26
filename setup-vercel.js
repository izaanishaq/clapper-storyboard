#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Vercel deployment assets...');

// First, ensure root public directory exists and copy app public files
const appPublicDir = path.join(__dirname, 'packages', 'app', 'public');
const rootPublicDir = path.join(__dirname, 'public');

if (fs.existsSync(appPublicDir)) {
  console.log('📂 Copying public assets to root...');
  
  // Remove existing root public if it exists
  if (fs.existsSync(rootPublicDir)) {
    fs.rmSync(rootPublicDir, { recursive: true });
  }
  
  // Copy app public to root
  fs.cpSync(appPublicDir, rootPublicDir, { recursive: true });
  console.log('✅ Copied public assets to root directory');
} else {
  console.log('⚠️  App public directory not found');
}

console.log('🎉 Vercel setup complete!');
