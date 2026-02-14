#!/usr/bin/env node
/**
 * Copy build artifacts from public/ to docs/ folder
 * This script is cross-platform compatible
 */

const fs = require('fs');
const path = require('path');

const artifacts = ['bundle.js', 'bundle.js.map', 'bundle.js.LICENSE.txt'];
const sourceDir = path.join(__dirname, '..', 'public');
const targetDir = path.join(__dirname, '..', 'docs');

console.log('📦 Copying build artifacts to docs folder...\n');

let successCount = 0;
let failCount = 0;

artifacts.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`✅ Copied ${file} (${sizeKB} KB)`);
      successCount++;
    } else {
      console.log(`⚠️  Skipped ${file} (not found)`);
    }
  } catch (error) {
    console.error(`❌ Failed to copy ${file}: ${error.message}`);
    failCount++;
  }
});

console.log(`\n📊 Summary: ${successCount} copied, ${failCount} failed`);

if (failCount > 0) {
  process.exit(1);
}

console.log('✅ Build artifacts successfully copied to docs folder!\n');
