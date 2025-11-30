# Script to push backend folder to GitHub

Write-Host "🚀 Pushing backend folder to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if remote exists
$remoteExists = git remote -v 2>&1
if ($LASTEXITCODE -ne 0 -or $remoteExists -eq "") {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/suhana-bhanu/attendance-system.git
}

# Add all files
Write-Host "Adding all files to git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Add backend and frontend folders"

# Set branch to main
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may need to enter your GitHub credentials" -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ Done! Check GitHub: https://github.com/suhana-bhanu/attendance-system" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify backend folder is on GitHub"
Write-Host "2. Go to Render dashboard"
Write-Host "3. Set Root Directory to: backend"
Write-Host "4. Click Manual Deploy"

