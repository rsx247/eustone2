# 🌐 Your EU Stone URLs

## **Current Status**

### **Local Development**
- **URL**: http://localhost:3003
- **Status**: ✅ Running
- **Access**: Only on your computer

---

## **1. ngrok URL (Quick Share)** ⚡

### **Get Your ngrok URL**:

**Option A: Web Interface** (Easiest)
1. Open: http://localhost:4040
2. Look for "Forwarding" section
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Option B: Terminal**
```bash
cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini
./get-ngrok-url.sh
```

**Option C: Direct API**
```bash
curl http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*'
```

### **If ngrok is not running**:
```bash
cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini
ngrok http 3003
```

Then check http://localhost:4040 for your URL.

**Share this URL with your client!** 📤

---

## **2. Railway URL (Permanent)** 🚂

### **To Deploy to Railway**:

1. **Login**:
   ```bash
   cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini
   railway login
   ```

2. **Initialize Project**:
   ```bash
   railway init
   ```
   - Select "New Project"
   - Name: `eu-stone` or `eustone`

3. **Set Environment Variable**:
   ```bash
   railway variables set DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Get Your URL**:
   ```bash
   railway domain
   ```
   Or check: https://railway.app/dashboard

**Result**: You'll get a permanent URL like `eustone-production.up.railway.app`

---

## **3. Vercel URL (Alternative)** ⚡

If you prefer Vercel:

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to: https://vercel.com/new
   - Import your GitHub repo
   - Deploy!

**Note**: Vercel requires PostgreSQL (SQLite won't work). See `DEPLOYMENT.md` for migration steps.

---

## **Quick Reference**

| Service | URL | Status | Use Case |
|---------|-----|--------|----------|
| **Local** | http://localhost:3003 | ✅ Running | Development |
| **ngrok** | Check http://localhost:4040 | ⏳ Starting | Quick client review |
| **Railway** | Deploy first | ⏳ Not deployed | Permanent staging |
| **Vercel** | Deploy first | ⏳ Not deployed | Production (needs Postgres) |

---

## **Right Now - Get ngrok URL**

1. Open: **http://localhost:4040** in your browser
2. Copy the HTTPS URL from the "Forwarding" section
3. Share with your client!

Or run:
```bash
cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini
./get-ngrok-url.sh
```

---

**Need help?** Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps!

