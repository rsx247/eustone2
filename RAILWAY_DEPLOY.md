# 🚂 Railway Deployment Guide - Quick Start

## 🎯 EASIEST METHOD: GitHub Integration (Recommended)

**This is the easiest way - no CLI needed!**

1. **Make sure your code is pushed to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push
   ```

2. **Go to Railway Dashboard**:
   - Visit: https://railway.app/new
   - Click **"Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub
   - Select repository: `rsx247/eustone2`
   - Select branch: `main`

3. **Railway will automatically**:
   - Detect it's a Next.js app
   - Use the `railway.toml` configuration
   - Start building

4. **Set Environment Variable**:
   - In Railway dashboard, go to your project
   - Click **"Variables"** tab
   - Click **"New Variable"**
   - Name: `DATABASE_URL`
   - Value: `file:./prisma/dev.db`
   - Click **"Add"**

5. **Deploy**:
   - Railway will automatically redeploy with the new variable
   - Wait for build to complete (2-3 minutes)

6. **Get Your URL**:
   - In Railway dashboard, click **"Settings"**
   - Scroll to **"Domains"**
   - Railway provides a free domain like: `eustone-production.up.railway.app`
   - Or click **"Generate Domain"** to get a custom one

7. **Initialize Database** (First time only):
   - In Railway dashboard, go to your service
   - Click **"Deployments"** tab
   - Click on the latest deployment
   - Click **"View Logs"** or use the terminal
   - Run these commands:
     ```bash
     railway run npx prisma db push
     railway run npx prisma db seed
     ```

**Done! Your site is live! 🎉**

---

## 🔧 ALTERNATIVE: CLI Method

If you prefer using the command line:

### Step 1: Login to Railway

Run this command in your terminal:
```bash
cd /Users/admin/Documents/EUSTONE/eustone2-new
railway login
```

This will open your browser to authenticate with Railway.

### Step 2: Use the Deployment Script

Run the automated script:
```bash
./deploy-railway.sh
```

Or manually:

### Step 2: Initialize Project

After logging in, run:
```bash
railway init
```

When prompted:
- Select "New Project"
- Name it: `eustone` or `eustone-demo`

### Step 3: Set Environment Variables

Set the database URL for SQLite:
```bash
railway variables set DATABASE_URL="file:./prisma/dev.db"
```

### Step 4: Deploy

Deploy your application:
```bash
railway up
```

This will:
- Build your Next.js app
- Generate Prisma client
- Deploy to Railway
- Give you a live URL

### Step 5: Get Your Live URL

After deployment completes:
```bash
railway domain
```

Or check your Railway dashboard: https://railway.app/dashboard

You'll get a URL like: `eustone-production.up.railway.app`

### Step 6: Initialize Database (First Time Only)

After first deployment, you need to seed the database:
```bash
railway run npx prisma db push
railway run npx prisma db seed
```

---

## Alternative: Deploy via GitHub (Easier)

If you prefer, you can deploy via Railway's GitHub integration:

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push
   ```

2. **Go to Railway Dashboard**:
   - Visit: https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository: `rsx247/eustone2`
   - Railway will automatically detect it's a Next.js app

3. **Set Environment Variables**:
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add: `DATABASE_URL` = `file:./prisma/dev.db`

4. **Deploy**:
   - Railway will automatically build and deploy
   - You'll get a live URL in the dashboard

---

## Troubleshooting

### Build Fails
- Make sure `railway.toml` includes Prisma generation (already done ✅)
- Check Railway logs: `railway logs`

### Database Issues
- SQLite file needs to persist, Railway handles this automatically
- If database is empty, run: `railway run npx prisma db seed`

### Port Issues
- Railway automatically sets `PORT` environment variable
- Next.js should use `process.env.PORT || 3000`

---

## Quick Commands Reference

```bash
# Login
railway login

# Initialize
railway init

# Set variables
railway variables set DATABASE_URL="file:./prisma/dev.db"

# Deploy
railway up

# View logs
railway logs

# Get URL
railway domain

# Run commands in Railway environment
railway run <command>
```

---

**Ready to deploy?** Run the commands above, or use the GitHub integration method! 🚀

