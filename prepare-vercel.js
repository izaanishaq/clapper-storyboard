#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the app's package.json
const appPackagePath = path.join(__dirname, 'packages/app/package.json');
const appPackage = JSON.parse(fs.readFileSync(appPackagePath, 'utf8'));

// Replace workspace dependencies with file paths
const workspaceDeps = [
  '@aitube/client',
  '@aitube/broadway', 
  '@aitube/clap',
  '@aitube/clapper-services',
  '@aitube/engine',
  '@aitube/timeline'
];

// Replace workspace:* with file: paths
workspaceDeps.forEach(dep => {
  if (appPackage.dependencies[dep]) {
    const packageName = dep.split('/')[1]; // Get the package name after @aitube/
    appPackage.dependencies[dep] = `file:../${packageName}`;
  }
});

// Write the updated package.json
fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2));
console.log('✅ Updated package.json with file: dependencies');

// Also create a backup
fs.writeFileSync(appPackagePath + '.backup', JSON.stringify(appPackage, null, 2));
console.log('✅ Created backup at packages/app/package.json.backup');
