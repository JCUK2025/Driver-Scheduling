# QUICK FIX: GitHub Pages Showing README Instead of App

## Problem
Visiting https://jcuk2025.github.io/Driver-Scheduling/ shows a README file instead of the Driver Scheduling application.

## Solution (Takes 2 minutes)

### Step 1: Change GitHub Pages Source
1. Go to: https://github.com/JCUK2025/Driver-Scheduling/settings/pages
2. Find the **"Source"** dropdown under "Build and deployment"
3. Change from **"Deploy from a branch"** to **"GitHub Actions"**
4. The setting saves automatically

### Step 2: Trigger Deployment
Option A - Push this PR:
```bash
# Merge this pull request - it will automatically deploy
```

Option B - Manual trigger:
```bash
# Go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"
```

### Step 3: Verify (after 1-2 minutes)
- Visit: https://jcuk2025.github.io/Driver-Scheduling/
- You should see the Driver Scheduling application, not a README

## Why This Happens

**Current (Incorrect) Setup:**
- GitHub Pages is set to "Deploy from a branch" (likely `/docs` folder)
- GitHub's branch deployment may render README.md files
- The app doesn't load properly

**Correct Setup:**
- GitHub Pages uses "GitHub Actions" as the source
- The `.github/workflows/deploy-pages.yml` workflow handles deployment
- Workflow builds and deploys the app automatically on every push to `main`
- The app loads correctly

## Verification

To verify your setup is correct, run:
```bash
npm install
node scripts/verify-pages-setup.js
```

All checks should pass.

## More Information

- Detailed instructions: `FIX_GITHUB_PAGES.md`
- Verification script: `scripts/verify-pages-setup.js`
- Workflow file: `.github/workflows/deploy-pages.yml`

---

**Bottom line: Change GitHub Pages source from "Deploy from a branch" to "GitHub Actions" in repository settings.**
