# GitHub Pages Setup Instructions

## 🎉 Your app is ready for automatic deployment!

The Driver Scheduling app is configured for fully automated GitHub Pages deployment.

## 📋 Automated Deployment - How It Works

The repository includes a **GitHub Actions workflow** (`.github/workflows/deploy-pages.yml`) that **automatically builds and deploys** the app to GitHub Pages whenever changes are pushed to the `main` branch.

### What Happens Automatically on Every Push:
1. ✅ **Fresh Build**: The workflow builds the application from source code
2. ✅ **Auto-Update**: The build output is automatically copied to the `docs/` folder
3. ✅ **Deployment**: The updated `docs/` folder is deployed to GitHub Pages
4. ✅ **Live App**: Your app is immediately accessible at: `https://jcuk2025.github.io/Driver-Scheduling/`

**🔥 This means you NEVER have to manually build or update the docs folder - it happens automatically on every push to main!**

### Why This Fixes the Previous Issue:
Previously, the `docs/` folder would become outdated because:
- Code changes were made in `src/`
- The `public/` folder was built with `npm run build`
- But the `docs/` folder was NOT updated
- GitHub Pages served the stale `docs/` folder

**Now**, the workflow ensures the `docs/` folder is always up-to-date by:
- Building fresh on every deployment
- Automatically copying the latest bundle
- Deploying the current version

### One-Time Setup Required:

If this is the first deployment, you need to enable GitHub Pages in repository settings:

1. **Navigate to Repository Settings**
   - Go to: https://github.com/JCUK2025/Driver-Scheduling/settings
   - Click on **Settings** in the top menu

2. **Enable GitHub Pages**
   - In the left sidebar, click **Pages** (under "Code and automation")
   - Under **Source**, select **"GitHub Actions"** ⚠️ (important - NOT "Deploy from a branch")
   - Click **Save**

3. **Wait for Deployment**
   - The workflow will automatically run on the next push to `main`
   - Check the **Actions** tab to monitor deployment progress
   - Deployment typically takes 2-3 minutes
   - Once complete, your app will be live at: `https://jcuk2025.github.io/Driver-Scheduling/`

## ✅ What's Included

The `docs/` folder contains:
- ✅ Complete standalone application
- ✅ All required assets (Leaflet CSS/JS, images)
- ✅ localStorage implementation for data persistence
- ✅ Relative paths for static hosting
- ✅ Professional UI with full functionality

## 🔄 How the App Works on GitHub Pages

When deployed to GitHub Pages (no backend server):
- The app automatically detects the missing API
- Switches to localStorage for data storage
- All features work identically:
  - Create delivery areas
  - Edit existing areas
  - Delete areas
  - Interactive map selection
  - Color-coded postcodes
- Data persists in the browser across sessions

## 🚀 Features Available

- **Interactive UK Postcode Map** with 44 postcodes
- **Visual Postcode Selection** - Click markers to select
- **Delivery Area Management** - Create, edit, delete
- **Color Coding** - Custom colors for each area
- **Data Persistence** - Browser localStorage
- **Responsive Design** - Works on all devices

## 🔍 Troubleshooting

### If the site doesn't appear:
1. Ensure you've selected `/docs` folder (not root)
2. Check that the main branch is selected
3. Wait a few minutes for deployment
4. Check Actions tab for any deployment errors
5. Try accessing in an incognito/private window

### If you see a 404 error:
- The branch or folder might be incorrectly configured
- Verify Settings → Pages shows `/docs` folder

### If you need to redeploy:
- Make any change to a file in the `docs/` folder
- Commit and push the change
- GitHub will automatically redeploy

## 📧 Support

If you encounter any issues:
1. Check the repository's Actions tab for deployment logs
2. Verify Settings → Pages configuration matches above
3. Ensure the `docs/` folder exists in your main branch

---

**Ready to go live!** Follow the steps above and your app will be accessible at:
**https://jcuk2025.github.io/Driver-Scheduling/**
