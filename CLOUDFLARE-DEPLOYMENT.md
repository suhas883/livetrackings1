# Cloudflare Pages Deployment Guide

## FULLY INDEPENDENT - NO SUPABASE, NO BOLT

This project is 100% independent and runs entirely on Cloudflare infrastructure.

## Quick Setup (5 minutes)

### 1. Connect to Cloudflare Pages
- Go to https://dash.cloudflare.com/
- Click Pages > Connect to Git
- Select GitHub > Authorize > Select suhas883/livetrackings1
- Click "Begin setup"

### 2. Build Configuration
Fill in these exact values:
- **Framework**: Vite
- **Build command**: `npm run build`  
- **Build output directory**: `dist`
- **Node.js version**: 18

### 3. Environment Variables (CRITICAL)
Add these in Cloudflare Pages Settings > Environment Variables:

**PRODUCTION ENVIRONMENT:**
```
ENVIRONMENT=production
VITE_API_URL=https://api.livetrackings1.pages.dev
```

**PREVIEW ENVIRONMENT:**
```
ENVIRONMENT=preview  
VITE_API_URL=https://preview-api.livetrackings1.pages.dev
```

### 4. Deploy
Click "Save and Deploy". First build will take 2-3 minutes.

## Site URL
Your live site: `https://livetrackings1.pages.dev`

## Features Included
- ✅ React + TypeScript Frontend
- ✅ Fully Functional Backend API
- ✅ Package Tracking System  
- ✅ Affiliate Links Management
- ✅ Email Notifications
- ✅ No Supabase (100% Cloudflare)
- ✅ No Bolt Dependency
- ✅ Free Forever

## Troubleshooting

### Build Fails
- Check Node.js version = 18
- Verify build command: `npm run build`
- Check dist folder exists

### Site Shows 404
- Make sure _redirects file exists in public/
- Refresh browser cache (Ctrl+Shift+R)

### API Not Working
- Verify VITE_API_URL environment variable
- Check Cloudflare Workers are deployed
- Look at deployment logs in Pages > Deployments

## Manual Deployment (Advanced)

If auto-deploy doesn't work:

```bash
npm install
npm run build
wrangler deploy
```

## Support
This is completely independent. All functionality is built into the repo.
