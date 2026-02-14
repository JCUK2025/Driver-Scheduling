# GitHub Pages Setup Instructions

## 🎉 Your app is ready for deployment!

The Driver Scheduling app has been prepared for GitHub Pages deployment in the `docs/` folder.

## 📋 Automated Deployment

The repository now includes a **GitHub Actions workflow** (`.github/workflows/deploy-pages.yml`) that automatically deploys the app to GitHub Pages whenever changes are pushed to the `main` branch.

### What Happens Automatically:
- ✅ On every push to `main`, the workflow builds and deploys the app
- ✅ The `docs/` folder contents are uploaded to GitHub Pages
- ✅ Your app becomes accessible at: `https://jcuk2025.github.io/Driver-Scheduling/`

### One-Time Setup Required:

If this is the first deployment, you need to enable GitHub Pages in repository settings:

1. **Navigate to Repository Settings**
   - Go to: https://github.com/JCUK2025/Driver-Scheduling/settings
   - Click on **Settings** in the top menu

2. **Enable GitHub Pages**
   - In the left sidebar, click **Pages** (under "Code and automation")
   - Under **Source**, select **"GitHub Actions"** (recommended)
   - Click **Save**

3. **Wait for Deployment**
   - The workflow will automatically run on the next push to `main`
   - Check the **Actions** tab to monitor deployment progress
   - Deployment typically takes 1-2 minutes
   - Once complete, your app will be live at: `https://jcuk2025.github.io/Driver-Scheduling/`

### Alternative Setup (Legacy Method):
If you prefer manual deployment without Actions:
- Under **Source**, select "Deploy from a branch"
- Select `main` branch and `/docs` folder
- Click **Save**

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
