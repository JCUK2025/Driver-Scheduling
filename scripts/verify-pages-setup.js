#!/usr/bin/env node
/**
 * Verification script for GitHub Pages deployment
 * Checks that all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('GitHub Pages Deployment Verification');
console.log('========================================\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function pass(message) {
  console.log(`✅ PASS: ${message}`);
  passCount++;
}

function fail(message) {
  console.log(`❌ FAIL: ${message}`);
  failCount++;
}

function warn(message) {
  console.log(`⚠️  WARN: ${message}`);
  warnCount++;
}

function info(message) {
  console.log(`ℹ️  INFO: ${message}`);
}

// Check 1: docs folder exists
console.log('\n1. Checking docs folder...');
if (fs.existsSync('docs')) {
  pass('docs folder exists');
} else {
  fail('docs folder does not exist');
}

// Check 2: docs/index.html exists and is valid
console.log('\n2. Checking docs/index.html...');
if (fs.existsSync('docs/index.html')) {
  const indexContent = fs.readFileSync('docs/index.html', 'utf8');
  
  if (indexContent.includes('<div id="root"></div>')) {
    pass('index.html contains React root div');
  } else {
    fail('index.html missing React root div');
  }
  
  if (indexContent.includes('bundle.js')) {
    pass('index.html references bundle.js');
  } else {
    fail('index.html does not reference bundle.js');
  }
  
  // Check for absolute vs relative paths (relative is correct for GitHub Pages)
  if (indexContent.includes('href="/') || indexContent.includes('src="/')) {
    warn('index.html uses absolute paths - should use relative paths for GitHub Pages');
  } else {
    pass('index.html uses relative paths (correct for GitHub Pages)');
  }
} else {
  fail('docs/index.html does not exist');
}

// Check 3: bundle.js exists
console.log('\n3. Checking bundle.js...');
if (fs.existsSync('docs/bundle.js')) {
  const stats = fs.statSync('docs/bundle.js');
  const sizeKB = (stats.size / 1024).toFixed(1);
  pass(`bundle.js exists (${sizeKB} KB)`);
  
  if (stats.size < 1000) {
    warn('bundle.js seems unusually small - may be incomplete');
  }
} else {
  fail('docs/bundle.js does not exist');
}

// Check 4: .nojekyll file exists
console.log('\n4. Checking .nojekyll file...');
if (fs.existsSync('docs/.nojekyll')) {
  pass('.nojekyll file exists (disables Jekyll processing)');
} else {
  fail('.nojekyll file missing - Jekyll may process the site incorrectly');
}

// Check 5: Required static assets
console.log('\n5. Checking static assets...');
const requiredAssets = ['leaflet.css', 'leaflet.js'];
requiredAssets.forEach(asset => {
  if (fs.existsSync(path.join('docs', asset))) {
    pass(`${asset} exists`);
  } else {
    fail(`${asset} missing`);
  }
});

// Check 6: No markdown files in docs
console.log('\n6. Checking for interfering markdown files...');
const files = fs.readdirSync('docs');
const mdFiles = files.filter(f => f.endsWith('.md') || f.toUpperCase().startsWith('README'));
if (mdFiles.length === 0) {
  pass('No markdown files in docs folder');
} else {
  warn(`Found markdown files in docs: ${mdFiles.join(', ')} - these might interfere with GitHub Pages`);
}

// Check 7: GitHub Actions workflow exists
console.log('\n7. Checking GitHub Actions workflow...');
if (fs.existsSync('.github/workflows/deploy-pages.yml')) {
  pass('deploy-pages.yml workflow exists');
  
  const workflowContent = fs.readFileSync('.github/workflows/deploy-pages.yml', 'utf8');
  
  if (workflowContent.includes('deploy-pages@v')) {
    pass('Workflow uses deploy-pages action (GitHub Actions deployment)');
  } else {
    fail('Workflow does not use deploy-pages action');
  }
  
  if (workflowContent.includes("path: './docs'") || workflowContent.includes('path: "./docs"')) {
    pass('Workflow uploads docs folder');
  } else {
    fail('Workflow does not upload docs folder');
  }
} else {
  fail('deploy-pages.yml workflow does not exist');
}

// Check 8: Build script exists
console.log('\n8. Checking build configuration...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts && pkg.scripts.build) {
    pass('npm run build script exists');
  } else {
    fail('npm run build script missing');
  }
} else {
  fail('package.json missing');
}

// Summary
console.log('\n========================================');
console.log('Summary:');
console.log(`  ✅ Passed: ${passCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log(`  ⚠️  Warnings: ${warnCount}`);
console.log('========================================\n');

if (failCount > 0) {
  console.log('❌ VERIFICATION FAILED: Fix the issues above before deploying\n');
  process.exit(1);
} else if (warnCount > 0) {
  console.log('⚠️  VERIFICATION PASSED WITH WARNINGS: Review warnings above\n');
  process.exit(0);
} else {
  console.log('✅ VERIFICATION PASSED: All checks passed!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Ensure GitHub Pages is configured to use "GitHub Actions" as the source');
  console.log('   2. Go to: Settings → Pages → Source → Select "GitHub Actions"');
  console.log('   3. Push changes to trigger deployment');
  console.log('   4. Visit: https://jcuk2025.github.io/Driver-Scheduling/\n');
  process.exit(0);
}
