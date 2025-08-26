#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define all packages and their dependencies
const packages = [
  'app', 'broadway', 'clap', 'clapper-services', 
  'client', 'colors', 'engine', 'io', 'timeline'
];

console.log('🔧 Fixing workspace dependencies for Vercel deployment...');

packages.forEach(pkg => {
  const packagePath = path.join(__dirname, `packages/${pkg}/package.json`);
  
  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️  Skipping ${pkg} - package.json not found`);
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  let hasChanges = false;

  // Fix workspace dependencies in dependencies
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => {
      if (dep.startsWith('@aitube/') && packageJson.dependencies[dep] === 'workspace:*') {
        const depName = dep.replace('@aitube/', '');
        packageJson.dependencies[dep] = `file:../${depName}`;
        hasChanges = true;
      }
    });
  }

  // Fix workspace dependencies in devDependencies
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => {
      if (dep.startsWith('@aitube/') && packageJson.devDependencies[dep] === 'workspace:*') {
        const depName = dep.replace('@aitube/', '');
        packageJson.devDependencies[dep] = `file:../${depName}`;
        hasChanges = true;
      }
    });
  }

  if (hasChanges) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated ${pkg}/package.json`);
  } else {
    console.log(`ℹ️  No changes needed for ${pkg}`);
  }
});

console.log('🎉 All workspace dependencies have been converted to file: paths!');
