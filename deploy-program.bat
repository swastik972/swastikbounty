@echo off
echo ============================================
echo Solana Program Deployment Helper
echo ============================================
echo.

REM Check if Solana is installed
where solana >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Solana CLI is not installed!
    echo.
    echo Please install Solana CLI first:
    echo 1. Visit: https://github.com/solana-labs/solana/releases
    echo 2. Download: solana-install-init-x86_64-pc-windows-msvc.exe
    echo 3. Run the installer
    echo 4. Restart this terminal
    echo.
    echo OR use Solana Playground: https://beta.solpg.io
    echo.
    pause
    exit /b 1
)

echo [OK] Solana CLI found
solana --version
echo.

REM Configure Solana to Devnet
echo Setting Solana to Devnet...
solana config set --url devnet
echo.

REM Check wallet
echo Checking wallet...
solana address
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No wallet found. Creating one...
    solana-keygen new --no-bip39-passphrase
)
echo.

REM Check balance
echo Checking SOL balance...
solana balance
echo.
echo [INFO] You need at least 1-2 SOL to deploy
echo Would you like to request an airdrop? (Y/N)
set /p AIRDROP=
if /i "%AIRDROP%"=="Y" (
    echo Requesting airdrop...
    solana airdrop 2
    timeout /t 3 /nobreak >nul
    solana balance
)
echo.

REM Check Rust
where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Rust/Cargo not found!
    echo Download from: https://rustup.rs/
    echo.
    pause
    exit /b 1
)

echo [OK] Cargo found
cargo --version
echo.

REM Add BPF target
echo Adding Solana BPF target...
rustup target add bpfel-unknown-unknown
echo.

REM Build program
echo Building Solana program...
cd solana-program
cargo build-bpf

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ============================================
echo BUILD SUCCESSFUL!
echo ============================================
echo.

REM Deploy
echo Ready to deploy to Devnet!
echo This will cost approximately 1-2 SOL
echo.
echo Deploy now? (Y/N)
set /p DEPLOY=

if /i "%DEPLOY%"=="Y" (
    echo.
    echo Deploying to Devnet...
    echo ============================================
    solana program deploy target/deploy/certificate_verification.so
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================
        echo DEPLOYMENT SUCCESSFUL!
        echo ============================================
        echo.
        echo IMPORTANT: Copy the Program ID above!
        echo.
        echo Next steps:
        echo 1. Copy the Program ID from above
        echo 2. Update frontend/src/components/IssueCertificate.tsx
        echo 3. Update frontend/src/components/RevokeCertificate.tsx
        echo 4. Replace REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT
        echo.
    ) else (
        echo.
        echo [ERROR] Deployment failed!
        echo Check error messages above
    )
)

cd ..
echo.
pause
