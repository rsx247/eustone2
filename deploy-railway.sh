#!/bin/bash

# Railway Deployment Script for EU Stone
# This script helps you deploy to Railway

set -e

echo "🚂 Railway Deployment Script"
echo "============================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
echo "Checking Railway login status..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  Not logged in to Railway"
    echo ""
    echo "Please run this command manually to login:"
    echo "  railway login"
    echo ""
    echo "This will open your browser for authentication."
    echo ""
    read -p "Press Enter after you've logged in, or Ctrl+C to cancel..."
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo ""
echo "📦 Setting up Railway project..."
echo ""

# Initialize project (if not already initialized)
if [ ! -f ".railway/project.json" ]; then
    echo "Initializing Railway project..."
    railway init
else
    echo "✅ Railway project already initialized"
fi

echo ""
echo "🔧 Setting environment variables..."
railway variables set DATABASE_URL="file:./prisma/dev.db"

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Getting your live URL..."
railway domain

echo ""
echo "📝 Next steps:"
echo "1. After first deployment, initialize the database:"
echo "   railway run npx prisma db push"
echo "   railway run npx prisma db seed"
echo ""
echo "2. View logs:"
echo "   railway logs"
echo ""
echo "3. Get your URL anytime:"
echo "   railway domain"
echo ""

