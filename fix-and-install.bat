@echo off
echo ========================================
echo Cleaning up npm for Windows...
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Step 1: Stopping any Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Cleaning npm cache...
call npm cache clean --force

echo Step 3: Removing node_modules (this may take a while on Windows)...
if exist node_modules (
    echo Deleting node_modules...
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo First attempt failed, trying alternative method...
        rd /s /q node_modules 2>nul
    )
    if exist node_modules (
        echo Using PowerShell to remove stubborn files...
        powershell -Command "Remove-Item -Path '.\node_modules' -Recurse -Force -ErrorAction SilentlyContinue"
    )
)

echo Step 4: Removing package-lock.json...
if exist package-lock.json del /f /q package-lock.json

echo Step 5: Installing dependencies (this will take a few minutes)...
echo Using --no-optional to skip optional packages...
call npm install --no-optional --legacy-peer-deps

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Installation complete!
    echo ========================================
    echo.
    echo To start the app, run:
    echo   npm run dev
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo ERROR: Installation failed!
    echo ========================================
    echo.
    echo Try running this script as Administrator
    pause
    exit /b 1
)
