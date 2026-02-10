# Quick Start Guide

## Prerequisites
1. Install [Phantom Wallet](https://phantom.app/) browser extension
2. Install [Node.js](https://nodejs.org/) (v18 or higher)
3. Install [Rust](https://rustup.rs/)
4. Install [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

## Fast Setup (5 minutes)

### 1. Setup Solana (Terminal 1)
```bash
# Set to devnet
solana config set --url devnet

# Create wallet (or use existing)
solana-keygen new

# Get SOL for testing
solana airdrop 2

# Build the program
cd solana-program
cargo build-bpf

# Deploy and save the Program ID
solana program deploy target/deploy/certificate_verification.so
```

### 2. Setup Frontend (Terminal 2)
```bash
# Install dependencies
cd frontend
npm install

# Update Program ID in these files:
# - src/components/IssueCertificate.tsx (line 37)
# - src/components/RevokeCertificate.tsx (line 31)
# Replace: REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT

# Start the app
npm run dev
```

### 3. Use the App
1. Open http://localhost:3000
2. Connect Phantom wallet
3. Make sure Phantom is on Devnet
4. Issue a certificate and copy the account address
5. Verify the certificate using the address
6. Try revoking it (only works if you're the issuer)

## Example Certificate Data
- Student Name: John Doe
- Course Name: Blockchain Development
- Certificate ID: CERT-2026-001
- Grade: A+

## Common Issues

**No SOL in wallet?**
```bash
solana airdrop 2
```

**Phantom not connecting?**
- Switch Phantom network to Devnet
- Refresh the page

**Build failed?**
```bash
rustup target add bpfel-unknown-unknown
```

## Next Steps
- Read the full [README.md](README.md)
- Customize certificate fields
- Deploy to mainnet for production
