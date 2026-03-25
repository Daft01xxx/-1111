@echo off
echo Deploying NaPiwas to Vercel...
cd /d "%~dp0"
if "%VERCEL_TOKEN%"=="" (
  echo ERROR: VERCEL_TOKEN is not set.
  echo Set it before deploy, for example:
  echo set VERCEL_TOKEN=your_vercel_token
  pause
  exit /b 1
)
npx vercel --token "%VERCEL_TOKEN%" --yes --prod
echo.
echo Done!
pause
