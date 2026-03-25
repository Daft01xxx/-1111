# Deploy napiwas-game-from-scratch to Vercel (production)
# Run from this directory: powershell -ExecutionPolicy Bypass -File deploy-vercel.ps1

$ErrorActionPreference = "Stop"

Write-Host "Deploying napiwas-game-from-scratch to Vercel..." -ForegroundColor Cyan

$vercelToken = $env:VERCEL_TOKEN
if ([string]::IsNullOrWhiteSpace($vercelToken)) {
    Write-Host "ERROR: VERCEL_TOKEN is not set." -ForegroundColor Red
    Write-Host "Set it before deploy, for example:" -ForegroundColor Yellow
    Write-Host '$env:VERCEL_TOKEN="your_vercel_token"' -ForegroundColor Yellow
    exit 1
}

# Check if npx is available
$npxPath = Get-Command npx -ErrorAction SilentlyContinue
if ($npxPath) {
    Write-Host "Found npx at: $($npxPath.Source)" -ForegroundColor Green
    Set-Location $PSScriptRoot
    npx vercel --token $vercelToken --yes --prod
} else {
    Write-Host "npx not found. Trying node..." -ForegroundColor Yellow
    $nodePath = Get-Command node -ErrorAction SilentlyContinue
    if ($nodePath) {
        Write-Host "Found node at: $($nodePath.Source)" -ForegroundColor Green
        Write-Host "Installing vercel globally..."
        npm install -g vercel
        Set-Location $PSScriptRoot
        vercel --token $vercelToken --yes --prod
    } else {
        Write-Host "ERROR: Neither npx nor node found. Please install Node.js first." -ForegroundColor Red
        Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
