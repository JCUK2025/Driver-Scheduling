#!/usr/bin/env node
/**
 * Copy build artifacts from public/ to docs/ folder
 * This script is cross-platform compatible
 */

const fs = require('fs');
const path = require('path');

// Required artifacts (build fails if missing)
const requiredArtifacts = ['bundle.js'];

// Optional artifacts (warnings only if missing)
const optionalArtifacts = ['bundle.js.map', 'bundle.js.LICENSE.txt'];

const sourceDir = path.join(__dirname, '..', 'public');
const targetDir = path.join(__dirname, '..', 'docs');

console.log('[COPY] Copying build artifacts to docs folder...\n');

let successCount = 0;
let failCount = 0;
let missingRequired = [];

// Copy required artifacts
requiredArtifacts.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`[OK] Copied ${file} (${sizeKB} KB)`);
      successCount++;
    } else {
      console.error(`[ERROR] Required file not found: ${file}`);
      missingRequired.push(file);
      failCount++;
    }
  } catch (error) {
    console.error(`[ERROR] Failed to copy ${file}: ${error.message}`);
    failCount++;
  }
});

// Copy optional artifacts
optionalArtifacts.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`[OK] Copied ${file} (${sizeKB} KB)`);
      successCount++;
    } else {
      console.log(`[WARN] Skipped ${file} (not found)`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to copy ${file}: ${error.message}`);
    failCount++;
  }
});

console.log(`\n[SUMMARY] ${successCount} copied, ${failCount} failed`);

if (missingRequired.length > 0) {
  console.error(`[ERROR] Missing required files: ${missingRequired.join(', ')}`);
  console.error('[ERROR] Build artifacts are incomplete. Did you run "npm run build" first?');
  process.exit(1);
}

if (failCount > 0) {
  console.error('[ERROR] Some files failed to copy. Check errors above.');
  process.exit(1);
}

console.log('[OK] Build artifacts successfully copied to docs folder!\n');
