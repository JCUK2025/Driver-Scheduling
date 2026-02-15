# Fix: GitHub Pages Showing README Instead of Application

## Problem
When visiting https://jcuk2025.github.io/Driver-Scheduling/, the site displays a README file instead of the Driver Scheduling application.

## Root Cause
GitHub Pages is likely configured to use **"Deploy from a branch"** mode instead of **"GitHub Actions"** mode. When in branch deployment mode with Jekyll processing, GitHub may render a README.md file instead of serving the index.html file.

## Solution

### Step 1: Configure GitHub Pages to Use GitHub Actions

1. **Go to Repository Settings**
   - Navigate to: https://github.com/JCUK2025/Driver-Scheduling/settings/pages
   - Or: Click "Settings" → "Pages" in the left sidebar

2. **Change the Source**
   - Under **"Build and deployment"** section
   - Under **"Source"**, select **"GitHub Actions"** from the dropdown
   - ⚠️ **Important**: Do NOT select "Deploy from a branch"
   - The setting should show: `Source: GitHub Actions`

3. **Save and Wait**
   - The setting is saved automatically
   - The next push to `main` branch will trigger a deployment
   - Check the "Actions" tab to monitor deployment progress

### Step 2: Trigger a Fresh Deployment

After changing the Pages source to "GitHub Actions", trigger a new deployment:

**Option A: Push a small change**
```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push
```

**Option B: Manually trigger the workflow**
- Go to: https://github.com/JCUK2025/Driver-Scheduling/actions/workflows/deploy-pages.yml
- Click "Run workflow" button
- Select `main` branch
- Click "Run workflow"

### Step 3: Verify Deployment

1. Go to the **Actions** tab
2. Wait for the "Deploy to GitHub Pages" workflow to complete (usually 1-2 minutes)
3. Once complete, visit: https://jcuk2025.github.io/Driver-Scheduling/
4. You should now see the Driver Scheduling application, not a README

## Why This Happens

### Branch Deployment Mode (OLD - INCORRECT)
- GitHub Pages serves files directly from a branch (e.g., `docs` folder)
- Jekyll processing may be enabled by default
- May render README.md files as the homepage
- Static file serving

### GitHub Actions Mode (NEW - CORRECT)
- GitHub Actions workflow builds and deploys the application
- Uses `deploy-pages@v4` action for modern deployment
- Bypasses Jekyll processing (via `.nojekyll` file)
- Serves the exact artifacts from the workflow
- More control over the build process

## Current Setup (Already Configured)

The repository already has everything needed:
- ✅ GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
- ✅ Build script (`npm run build`)
- ✅ Copy script (`scripts/copy-to-docs.js`)
- ✅ Proper `docs/index.html` with relative paths
- ✅ `.nojekyll` file to disable Jekyll
- ✅ All required assets (bundle.js, leaflet.css, etc.)

**The only missing piece is the repository settings configuration to use GitHub Actions as the deployment source.**

## Verification

After making the change, verify:

1. **Check Pages Settings**
   - Settings → Pages should show "Source: GitHub Actions"

2. **Check Latest Deployment**
   - Actions → "Deploy to GitHub Pages" should show recent successful run

3. **Check Live Site**
   - https://jcuk2025.github.io/Driver-Scheduling/ should display the app

## Troubleshooting

### If you still see a README:
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Try accessing in an incognito/private window
3. Wait 5-10 minutes for DNS/CDN to update
4. Check that Source is set to "GitHub Actions" (not "Deploy from a branch")

### If you see a 404 error:
1. Verify the workflow completed successfully in Actions tab
2. Check that the `docs` folder exists in the `main` branch
3. Verify `.nojekyll` file is present in `docs` folder

### If the deployment fails:
1. Check Actions tab for error messages
2. Verify all dependencies installed correctly
3. Ensure `npm run build` completes successfully

## Additional Notes

- The `.nojekyll` file disables Jekyll processing
- The workflow runs automatically on every push to `main`
- Data persists in browser localStorage (no backend needed for GitHub Pages)
- The app is fully functional with all features working

---

**Once you change the Pages source to "GitHub Actions", the site will work correctly!**
