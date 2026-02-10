@echo off
echo ========================================
echo Firebase Deployment From Main Folder
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing Firebase Functions dependencies...
cd functions
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install functions dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo Step 2: Building Next.js frontend...
cd main\frontend
call npm install
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful!
echo ========================================
echo.

cd ..\..

echo Step 3: Deploying to Firebase...
call firebase deploy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Your app is now live!
    echo Check the Firebase console for the URL
) else (
    echo.
    echo [ERROR] Deployment failed!
    echo Make sure you're logged into Firebase
    echo Run: firebase login
)

echo.
pause
