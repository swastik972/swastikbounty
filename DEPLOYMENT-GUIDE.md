# Solana Program Deployment Guide for Windows

## Option 1: Install Solana CLI (Recommended)

### Step 1: Download Solana CLI Manually
1. Visit: https://github.com/solana-labs/solana/releases
2. Download: `solana-install-init-x86_64-pc-windows-msvc.exe` (latest version)
3. Run the installer
4. Restart your terminal/PowerShell

### Step 2: Verify Installation
```powershell
solana --version
```

### Step 3: Configure for Devnet
```powershell
solana config set --url devnet
```

### Step 4: Create Wallet (if you don't have one)
```powershell
solana-keygen new --outfile ~\.config\solana\id.json
```

### Step 5: Get SOL for Deployment
```powershell
solana airdrop 2
```

### Step 6: Install Rust (if not installed)
Download from: https://rustup.rs/

### Step 7: Add Solana BPF Target
```powershell
rustup target add bpfel-unknown-unknown
```

### Step 8: Build the Program
```powershell
cd solana-program
cargo build-bpf
```

### Step 9: Deploy to Devnet
```powershell
solana program deploy target/deploy/certificate_verification.so
```

This will output a **Program ID** like:
```
Program Id: 7a8Bx9d3FgH2kL5mN6pQ1rS4tU7vW9xY2zA3bC5dE8fG
```

### Step 10: Update Frontend
Copy the Program ID and update these files:
- `frontend/src/components/IssueCertificate.tsx` (line ~37)
- `frontend/src/components/RevokeCertificate.tsx` (line ~31)

Replace `REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT` with your actual Program ID.

---

## Option 2: Use Solana Playground (No Installation Required)

### Quick Deploy via Browser:

1. Visit: https://beta.solpg.io
2. Create a new project
3. Copy the Rust code from `solana-program/src/lib.rs`
4. Paste it into Solana Playground
5. Click "Build" button
6. Click "Deploy" button
7. Copy the Program ID
8. Update your frontend files

---

## Option 3: Use Mock Program ID (For Testing UI Only)

If you just want to see the UI working without actual blockchain:

**Use this mock Program ID:**
```
CertVerfxyz123456789abcdefghijk1234567890ABC
```

Update in:
- `frontend/src/components/IssueCertificate.tsx`
- `frontend/src/components/RevokeCertificate.tsx`

**Note:** This won't actually work with blockchain, but the UI will load.

---

## Troubleshooting

### Error: "Insufficient funds"
```powershell
solana airdrop 2
solana balance
```

### Error: "Program build failed"
Make sure Rust is installed:
```powershell
rustc --version
cargo --version
```

### Error: "Cannot deploy"
Check your SOL balance:
```powershell
solana balance
```

Need at least 1-2 SOL for deployment on devnet.

---

## After Deployment

Once deployed successfully:

1. ✅ Save your Program ID
2. ✅ Update frontend files
3. ✅ Restart `npm run dev`
4. ✅ Connect Phantom wallet (set to Devnet)
5. ✅ Test issuing a certificate
