# Quick Deployment Helper Script for Windows PowerShell
# This script helps you prepare for deployment

Write-Host "🚀 Attendance System Deployment Helper" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "📝 Creating backend\.env file..." -ForegroundColor Yellow
    Write-Host ""
    
    $MONGODB_URI = Read-Host "Enter MongoDB connection string"
    $JWT_SECRET_INPUT = Read-Host "Enter JWT Secret (or press Enter to generate)"
    
    if ([string]::IsNullOrWhiteSpace($JWT_SECRET_INPUT)) {
        $JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        Write-Host "Generated JWT Secret: $JWT_SECRET" -ForegroundColor Green
    } else {
        $JWT_SECRET = $JWT_SECRET_INPUT
    }
    
    $envContent = @"
PORT=5000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
} else {
    Write-Host "✅ backend\.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Deployment Checklist:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. MongoDB Atlas:" -ForegroundColor Yellow
Write-Host "   - Create cluster at https://www.mongodb.com/cloud/atlas"
Write-Host "   - Get connection string"
Write-Host ""
Write-Host "2. Backend (Render):" -ForegroundColor Yellow
Write-Host "   - Push code to GitHub"
Write-Host "   - Go to https://render.com"
Write-Host "   - Create Web Service"
Write-Host "   - Root Directory: backend"
Write-Host "   - Start Command: npm start"
Write-Host "   - Add environment variables from backend\.env"
Write-Host ""
Write-Host "3. Frontend (Vercel):" -ForegroundColor Yellow
Write-Host "   - Go to https://vercel.com"
Write-Host "   - Import GitHub repo"
Write-Host "   - Root Directory: frontend"
Write-Host "   - Add REACT_APP_API_URL = https://your-backend.onrender.com/api"
Write-Host ""
Write-Host "📖 See EASY_DEPLOY.md for detailed steps!" -ForegroundColor Cyan
Write-Host ""

