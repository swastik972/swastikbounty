# Blockchain-Based Certificate Verification System

A decentralized certificate verification system built on Solana blockchain using Phantom wallet integration. This system allows institutions to issue tamper-proof certificates and enables anyone to verify their authenticity on the blockchain.

## 🌟 Features

- **Issue Certificates**: Create blockchain-verified certificates with student details
- **Verify Certificates**: Instantly verify certificate authenticity using blockchain
- **Revoke Certificates**: Revoke certificates when necessary (issuer only)
- **Phantom Wallet Integration**: Secure wallet connection using Phantom
- **Immutable Records**: All certificate data stored permanently on Solana blockchain
- **Tamper-Proof**: Blockchain ensures certificates cannot be forged or altered

## 🏗️ Project Structure

```
Mini-Hackthon/
├── solana-program/          # Solana smart contract (Rust)
│   ├── src/
│   │   └── lib.rs          # Main program logic
│   ├── Cargo.toml          # Rust dependencies
│   └── Xargo.toml          # Build configuration
│
└── frontend/               # Next.js frontend application
    ├── src/
    │   ├── app/           # Next.js app directory
    │   │   ├── page.tsx   # Main page
    │   │   └── layout.tsx # Root layout
    │   └── components/    # React components
    │       ├── WalletContextProvider.tsx
    │       ├── IssueCertificate.tsx
    │       ├── VerifyCertificate.tsx
    │       └── RevokeCertificate.tsx
    └── package.json       # Node dependencies
```

## 📋 Prerequisites

### For Solana Program Development:
- Rust (latest stable version)
- Solana CLI tools
- Node.js 18+ and npm/yarn

### For Frontend Development:
- Node.js 18+
- npm or yarn
- Phantom Wallet browser extension

## 🚀 Installation & Setup

### Step 1: Install Solana CLI

**Windows (PowerShell):**
```powershell
# Download and install
cmd /c "curl https://release.solana.com/v1.18.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe"
C:\solana-install-tmp\solana-install-init.exe v1.18.0

# Add to PATH (restart terminal after)
setx PATH "%PATH%;%USERPROFILE%\.local\share\solana\install\active_release\bin"
```

**Linux/Mac:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

Verify installation:
```bash
solana --version
```

### Step 2: Install Rust

**Windows:**
Download and run: https://rustup.rs/

**Linux/Mac:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Add BPF target:
```bash
rustup target add bpfel-unknown-unknown
```

### Step 3: Configure Solana

```bash
# Set to devnet for testing
solana config set --url devnet

# Create a new keypair (or use existing)
solana-keygen new --outfile ~/.config/solana/id.json

# Get your public key
solana address

# Airdrop SOL for testing (devnet only)
solana airdrop 2
```

### Step 4: Build and Deploy Solana Program

Navigate to the Solana program directory:
```bash
cd solana-program
```

Build the program:
```bash
cargo build-bpf
```

Deploy the program:
```bash
solana program deploy target/deploy/certificate_verification.so
```

**Important**: Save the Program ID that is displayed after deployment! You'll need it for the frontend.

Example output:
```
Program Id: 7X8Zq9YvJ3kX4mR2nP5wL6tC1sA9bK4vD3eF2gH8jN5m
```

### Step 5: Setup Frontend

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
# or
yarn install
```

### Step 6: Configure Program ID

Open these files and replace `REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT` with your actual Program ID:

1. [frontend/src/components/IssueCertificate.tsx](frontend/src/components/IssueCertificate.tsx)
2. [frontend/src/components/RevokeCertificate.tsx](frontend/src/components/RevokeCertificate.tsx)

```typescript
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE");
```

### Step 7: Run the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage Guide

### 1. Connect Phantom Wallet
- Install Phantom wallet extension in your browser
- Click "Select Wallet" button
- Choose Phantom and connect your wallet
- Make sure you're on Devnet network

### 2. Issue a Certificate
- Navigate to "Issue Certificate" tab
- Fill in the form:
  - Student Name
  - Course Name
  - Certificate ID (unique identifier)
  - Grade
- Click "Issue Certificate"
- Approve the transaction in Phantom wallet
- Save the Certificate Account address displayed in the success message

### 3. Verify a Certificate
- Navigate to "Verify Certificate" tab
- Enter the Certificate Account address
- Click "Verify Certificate"
- View the certificate details if valid
- Check if the certificate has been revoked

### 4. Revoke a Certificate
- Navigate to "Revoke Certificate" tab
- Enter the Certificate Account address
- Click "Revoke Certificate" (must be the original issuer)
- Approve the transaction in Phantom wallet

## 🔧 Technical Details

### Smart Contract (Solana Program)

The Solana program is written in Rust and includes:

**Certificate Structure:**
```rust
pub struct Certificate {
    pub student_name: String,
    pub course_name: String,
    pub issue_date: i64,
    pub issuer: Pubkey,
    pub certificate_id: String,
    pub grade: String,
    pub is_revoked: bool,
}
```

**Instructions:**
- `IssueCertificate`: Creates a new certificate on-chain
- `VerifyCertificate`: Reads and verifies certificate data
- `RevokeCertificate`: Marks a certificate as revoked (issuer only)

### Frontend Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **@solana/web3.js**: Solana blockchain interaction
- **@solana/wallet-adapter**: Wallet connection management
- **Borsh**: Binary serialization for Solana data

## 📱 Network Configuration

The application is configured to use Solana Devnet by default. To switch networks:

Edit [frontend/src/components/WalletContextProvider.tsx](frontend/src/components/WalletContextProvider.tsx):

```typescript
// Change this line:
const network = WalletAdapterNetwork.Devnet;

// Options:
// - WalletAdapterNetwork.Devnet (for testing)
// - WalletAdapterNetwork.Testnet
// - WalletAdapterNetwork.Mainnet (for production)
```

## 🔐 Security Features

- Only the original issuer can revoke a certificate
- All transactions require wallet signature
- Certificate data is immutable on the blockchain
- Revocation status is permanently recorded
- Timestamp verification for issue dates

## 🛠️ Development Commands

### Solana Program
```bash
# Build program
cargo build-bpf

# Run tests
cargo test

# Deploy to devnet
solana program deploy target/deploy/certificate_verification.so

# Check program info
solana program show <PROGRAM_ID>
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Testing

### Testing the Solana Program
```bash
cd solana-program
cargo test
```

### Testing Certificate Flow
1. Issue a test certificate
2. Copy the certificate account address
3. Verify the certificate
4. Attempt to revoke (as issuer)
5. Verify again to see revoked status

## 🐛 Troubleshooting

**Issue: Transaction fails with "insufficient funds"**
- Solution: Ensure your wallet has SOL. Use `solana airdrop 2` on devnet

**Issue: "Program ID not found"**
- Solution: Make sure you've deployed the program and updated the Program ID in the frontend

**Issue: Wallet won't connect**
- Solution: Ensure Phantom wallet is installed and set to the correct network (Devnet)

**Issue: Build errors in Rust**
- Solution: Make sure you've added the BPF target: `rustup target add bpfel-unknown-unknown`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Solana documentation: https://docs.solana.com

## 🎯 Future Enhancements

- [ ] Batch certificate issuance
- [ ] PDF certificate generation
- [ ] Email notifications
- [ ] Multi-signature issuance
- [ ] Certificate templates
- [ ] Search functionality
- [ ] Analytics dashboard
- [ ] API for third-party integration

---

**Built with ❤️ using Solana and Phantom Wallet**
