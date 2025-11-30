#!/bin/bash

# Quick Deployment Helper Script
# This script helps you prepare for deployment

echo "🚀 Attendance System Deployment Helper"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    echo ""
    read -p "Enter MongoDB connection string: " MONGODB_URI
    read -p "Enter JWT Secret (or press Enter to generate): " JWT_SECRET
    
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        echo "Generated JWT Secret: $JWT_SECRET"
    fi
    
    cat > backend/.env << EOF
PORT=5000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "1. MongoDB Atlas:"
echo "   - Create cluster at https://www.mongodb.com/cloud/atlas"
echo "   - Get connection string"
echo ""
echo "2. Backend (Render):"
echo "   - Push code to GitHub"
echo "   - Go to https://render.com"
echo "   - Create Web Service"
echo "   - Root Directory: backend"
echo "   - Start Command: npm start"
echo "   - Add environment variables from backend/.env"
echo ""
echo "3. Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repo"
echo "   - Root Directory: frontend"
echo "   - Add REACT_APP_API_URL = https://your-backend.onrender.com/api"
echo ""
echo "📖 See EASY_DEPLOY.md for detailed steps!"
echo ""

