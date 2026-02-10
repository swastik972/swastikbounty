@echo off
cd /d "%~dp0frontend"
echo Current directory: %CD%
echo.
echo Starting Next.js development server...
echo.
call npx next dev
