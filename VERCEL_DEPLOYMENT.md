# Vercel Deployment Guide

This guide explains how to deploy Burundanga to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Environment variables configured

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Select your GitHub repository (`burunndng/schema`)
3. Configure project settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## 2. Set Environment Variables

In **Vercel Dashboard → Settings → Environment Variables**, add:

```
GEMINI_API_KEY = your_gemini_api_key_here
DATABASE_URL = your_postgres_url
REACT_APP_API_URL = https://your-app-domain.com (or localhost:3001 for development)
```

**Important**: Set the Scope to **Production, Preview, and Development** so the variables are available during build time.

Steps:
1. Go to Vercel Dashboard → Select your project
2. Click **Settings** → **Environment Variables**
3. Click **Add New** for each variable
4. Enter the name and value
5. Select all scopes (Production, Preview, Development)
6. Click **Save**
7. Redeploy your project

### 3. Deploy

Push your code to the `main` branch:
```bash
git push origin main
```

Vercel will automatically build and deploy your changes.

## Configuration Files

### `vercel.json`
Configures:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Rewrites**: Client-side routing (all unknown routes → index.html)

This ensures:
- Assets are served correctly at the root path (`/`)
- Deep linking works (e.g., `/forum`, `/discussions`)
- Single Page Application routing functions properly
- All routes served from `index.html` for client-side routing

Note: Environment variables are set in Vercel Dashboard, not in this file.

### `vite.config.ts`
Dynamically sets base path:
- GitHub Pages: `/schema/`
- Vercel & Others: `/` (root)

Detects environment: `process.env.GITHUB_ACTIONS === 'true'`

## Understanding the 404 Error

The "Failed to load resource: 404" error happens because:

1. **Wrong Base Path**: Vite was building with `/schema/` base path
   - ✅ Fixed: Now detects deployment environment and uses correct base path

2. **Client-Side Routing**: React router navigates to `/forum` but server doesn't know it
   - ✅ Fixed: `vercel.json` rewrites all routes to `index.html`

3. **Asset Paths**: CSS, JS, images need correct paths
   - ✅ Fixed: Vite now uses correct base path

## Testing Locally

```bash
# Build production bundle
npm run build

# Preview the build (simulates Vercel environment)
npm run preview
```

Visit `http://localhost:4173` and test:
- Navigate to different pages
- Refresh page in different routes (should work)
- Check browser console for 404 errors

## Frontend API Routes

If using the Forum with database, ensure `REACT_APP_API_URL` is set correctly:

**Local Development:**
```
REACT_APP_API_URL=http://localhost:3001
```

**Vercel Deployment:**
Set to your API server URL (if hosted separately):
```
REACT_APP_API_URL=https://your-api-domain.com
```

Or deploy API as Vercel Function in `api/` directory.

## Production Checklist

- ✅ Vite base path configured correctly
- ✅ Client-side routing (vercel.json rewrites)
- ✅ Environment variables set in Vercel dashboard
- ✅ Build completes without errors
- ✅ Assets load correctly (no 404s)
- ✅ Deep linking works (refresh on any page)
- ✅ Chat widget responsive on all devices
- ✅ Mobile menu works on small screens

## Troubleshooting

### Still getting 404 errors?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+F5)
3. **Check Network tab** in DevTools to see which URL is failing
4. **Verify Vercel deployment** shows correct base path in build logs

### Mobile menu not working?

1. Check browser console for JavaScript errors
2. Ensure MobileMenu component imported correctly
3. Test on incognito window (bypass cache)

### Chat widget issues?

1. Check that `REACT_APP_API_URL` is set correctly
2. Verify API server is running (if using forum feature)
3. Check CORS settings if API is on different domain

## GitHub Pages vs Vercel

| Feature | GitHub Pages | Vercel |
|---------|--------------|--------|
| Base Path | `/schema/` | `/` |
| Build | Automatic | Automatic |
| Environment Vars | GitHub Secrets | Vercel Dashboard |
| Client-Side Routing | GitHub Pages config | vercel.json |
| SSL | Yes | Yes |
| Custom Domain | Yes | Yes |

## Re-deployment

After making changes:

```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

Vercel automatically redeploys when you push to `main`.

To redeploy without code changes, use Vercel Dashboard → Deployments → Redeploy.
