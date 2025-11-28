# 🚀 EU Stone - Deployment Guide

## **Recommended: Deploy to Vercel**

Vercel is the best option for Next.js apps (they created Next.js). It's **free** for hobby projects.

---

## **⚠️ Important: Database Issue**

Your current setup uses **SQLite** (`prisma/dev.db`) which **won't work** on Vercel because:
- Vercel uses serverless functions (no persistent file system)
- SQLite needs file storage
- Database file would be wiped on every deployment

**Solution**: Use a hosted database like **Vercel Postgres** (free tier available).

---

## **🎯 Option 1: Quick Deploy to Vercel (Recommended)**

### **Step 1: Install Vercel CLI** ✅
```bash
npm install -g vercel
```

### **Step 2: Set Up Vercel Postgres** (Free)

1. **Sign up at**: https://vercel.com/signup
2. **Create new project**
3. **Add Vercel Postgres**:
   - Go to Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose free "Hobby" plan
   - Copy the `DATABASE_URL` connection string

### **Step 3: Update Prisma Schema**

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### **Step 4: Create Production Environment File**

Create `.env.production`:
```env
DATABASE_URL="postgres://username:password@host/database?sslmode=require"
```

### **Step 5: Deploy**

```bash
cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini

# Login to Vercel
vercel login

# Deploy (first time will ask configuration questions)
vercel --prod

# After deployment, run migrations
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

**Deploy command will**:
- Build your Next.js app
- Upload to Vercel's CDN
- Provide a live URL (e.g., `eustone.vercel.app`)

---

## **🎯 Option 2: Deploy to Railway.app** (Also Easy)

Railway supports SQLite directly (no database change needed).

### **Steps**:

1. **Sign up**: https://railway.app/
2. **Install CLI**: `npm install -g @railway/cli`
3. **Deploy**:
```bash
railway login
railway init
railway up
```

4. **Add Domain**: Railway will give you a free URL like `eustone.railway.app`

**Advantages**:
- ✅ Keep SQLite (no schema changes)
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Simple deployment

---

## **🎯 Option 3: Deploy to Netlify**

Similar to Vercel, but you'll need a hosted database.

### **Steps**:

1. **Sign up**: https://netlify.com/
2. **Install CLI**: `npm install -g netlify-cli`
3. **Deploy**:
```bash
netlify login
netlify init
netlify deploy --prod
```

---

## **🎯 Option 4: Self-Host on VPS** (More Control)

Deploy to DigitalOcean, AWS, or any VPS.

### **Requirements**:
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

### **Steps**:

```bash
# On your VPS
git clone <your-repo>
cd eu-stone-gemini
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
pm2 start npm --name "eustone" -- start
```

---

## **📦 Pre-Deployment Checklist**

Before deploying, ensure:

- [ ] Environment variables are set
  - `DATABASE_URL`
  - `NEXT_PUBLIC_SITE_URL`
  - Any API keys

- [ ] Database is configured
  - Switch to PostgreSQL for Vercel/Netlify
  - Or use Railway for SQLite

- [ ] Images are accessible
  - Upload `public/images/legacy/` to CDN or hosting
  - Update image URLs in database if needed

- [ ] Build works locally
  ```bash
  npm run build
  npm start
  ```

- [ ] Environment-specific settings
  - Update contact info in footer
  - Set proper domain in `next.config.ts`
  - Configure CORS if needed

---

## **🔧 Recommended: Migrate to PostgreSQL**

Since you want to deploy online, let's switch to PostgreSQL now:

### **Local PostgreSQL Setup** (for development)

```bash
# Install PostgreSQL (Mac)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb eustone_dev

# Update .env
DATABASE_URL="postgresql://admin:@localhost:5432/eustone_dev?schema=public"
```

### **Update Schema**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **Migrate Data**

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## **🚀 My Recommended Flow**

### **For Quick Demo** (5 minutes):
1. Use **Vercel** + **Vercel Postgres** (free)
2. Change schema to PostgreSQL
3. Run `vercel --prod`
4. Share URL: `eustone.vercel.app`

### **For Production** (1 hour):
1. Use **Vercel** for hosting (free/cheap)
2. Use **Supabase** or **Neon** for PostgreSQL (free tier)
3. Set up custom domain (eustone.nl)
4. Configure CDN for images
5. Add monitoring (Vercel Analytics)

---

## **💡 Want Me to Deploy It Now?**

I can:
1. ✅ Install Vercel CLI (done)
2. ⏳ Convert SQLite → PostgreSQL
3. ⏳ Deploy to Vercel
4. ⏳ Run database migrations
5. ⏳ Provide live URL

**But I need**:
- Your Vercel account (I'll guide you through login)
- Permission to switch to PostgreSQL
- ~10 minutes for deployment process

**Just say "yes, deploy it" and I'll handle everything!** 🚀

---

## **Alternative: Quick Test Deployment** (No Database Changes)

If you just want to see it online quickly without database:

1. **Vercel Static Export** (no database, just frontend):
```bash
# Add to next.config.ts
output: 'export'

# Build and deploy
npm run build
vercel --prod
```

⚠️ **Limitation**: No dynamic data, products won't load (database required)

---

**What would you like to do?**

A. Deploy to Vercel with PostgreSQL (recommended, ~10 min)  
B. Deploy to Railway with SQLite (easier, ~5 min)  
C. Just give me instructions, I'll do it manually  
D. Set up self-hosted VPS deployment  

Let me know and I'll get it online! 🌐



