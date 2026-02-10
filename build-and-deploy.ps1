# Build and Deploy Script for Windows PowerShell

Write-Host "🚀 Certificate Verification System - Build & Deploy" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Solana is installed
Write-Host "Checking Solana installation..." -ForegroundColor Yellow
$solanaVersion = solana --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Solana CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://docs.solana.com/cli/install-solana-cli-tools" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Solana installed: $solanaVersion" -ForegroundColor Green

# Check if Rust is installed
Write-Host "Checking Rust installation..." -ForegroundColor Yellow
$rustVersion = cargo --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Rust not found. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://rustup.rs/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Rust installed: $rustVersion" -ForegroundColor Green

# Configure Solana to devnet
Write-Host ""
Write-Host "Configuring Solana to devnet..." -ForegroundColor Yellow
solana config set --url devnet
Write-Host "✅ Configured to devnet" -ForegroundColor Green

# Check wallet balance
Write-Host ""
Write-Host "Checking wallet balance..." -ForegroundColor Yellow
$balance = solana balance 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating new keypair..." -ForegroundColor Yellow
    solana-keygen new --no-bip39-passphrase
}

$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor Cyan

if ($balance -match "^0\.") {
    Write-Host "Requesting airdrop..." -ForegroundColor Yellow
    solana airdrop 2
    Write-Host "✅ Airdrop received" -ForegroundColor Green
}

# Build Solana program
Write-Host ""
Write-Host "Building Solana program..." -ForegroundColor Yellow
Set-Location solana-program

# Add BPF target if not already added
rustup target add bpfel-unknown-unknown 2>$null

cargo build-bpf
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Program built successfully" -ForegroundColor Green

# Deploy program
Write-Host ""
Write-Host "Deploying program to devnet..." -ForegroundColor Yellow
$deployOutput = solana program deploy target/deploy/certificate_verification.so 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host $deployOutput -ForegroundColor Red
    exit 1
}

# Extract Program ID
$programId = ($deployOutput | Select-String -Pattern "Program Id: (.+)").Matches.Groups[1].Value
Write-Host "✅ Program deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Save this Program ID!" -ForegroundColor Yellow
Write-Host "Program ID: $programId" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Save Program ID to file
$programId | Out-File -FilePath "..\program-id.txt" -NoNewline
Write-Host "Program ID saved to program-id.txt" -ForegroundColor Cyan

# Return to root directory
Set-Location ..

# Update frontend with Program ID
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update Program ID in frontend/src/components/IssueCertificate.tsx" -ForegroundColor White
Write-Host "2. Update Program ID in frontend/src/components/RevokeCertificate.tsx" -ForegroundColor White
Write-Host "3. Run 'cd frontend && npm install && npm run dev'" -ForegroundColor White
Write-Host ""
Write-Host "Or update automatically? (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Updating frontend files..." -ForegroundColor Yellow
    
    # Update IssueCertificate.tsx
    $issueFile = "frontend\src\components\IssueCertificate.tsx"
    if (Test-Path $issueFile) {
        $content = Get-Content $issueFile -Raw
        $content = $content -replace 'REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT', $programId
        $content | Set-Content $issueFile -NoNewline
        Write-Host "✅ Updated IssueCertificate.tsx" -ForegroundColor Green
    }
    
    # Update RevokeCertificate.tsx
    $revokeFile = "frontend\src\components\RevokeCertificate.tsx"
    if (Test-Path $revokeFile) {
        $content = Get-Content $revokeFile -Raw
        $content = $content -replace 'REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT', $programId
        $content | Set-Content $revokeFile -NoNewline
        Write-Host "✅ Updated RevokeCertificate.tsx" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 All done! Run 'npm run dev' in the frontend folder to start" -ForegroundColor Cyan
    }
    
    Set-Location ..
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
