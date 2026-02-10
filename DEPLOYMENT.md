# Certificate Verification System - Deployment Guide

## Deploying to Solana Mainnet

### Prerequisites
- Production wallet with sufficient SOL
- Tested program on devnet
- Audited smart contract code

### Step 1: Update Configuration

1. **Generate Production Keypair**
```bash
solana-keygen new --outfile ~/my-solana-wallet/production-keypair.json
```

2. **Switch to Mainnet**
```bash
solana config set --url mainnet-beta
```

3. **Fund Your Wallet**
Transfer SOL to your production wallet address:
```bash
solana address
```

### Step 2: Build for Production

```bash
cd solana-program
cargo build-bpf --release
```

### Step 3: Deploy Program

```bash
solana program deploy target/deploy/certificate_verification.so
```

Save the Program ID for later!

### Step 4: Update Frontend

Edit `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_PROGRAM_ID=your_mainnet_program_id_here
NEXT_PUBLIC_NETWORK=mainnet-beta
```

Update `WalletContextProvider.tsx`:
```typescript
const network = WalletAdapterNetwork.Mainnet;
```

### Step 5: Deploy Frontend

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
cd frontend
vercel
```

**Option 2: Other Platforms**
- Netlify
- AWS Amplify
- Google Cloud Platform
- Your own server

## Environment Variables

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_PROGRAM_ID=your_program_id
NEXT_PUBLIC_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

## Security Checklist

- [ ] Audit smart contract code
- [ ] Test thoroughly on devnet
- [ ] Secure your keypair (never commit to git)
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS for your website
- [ ] Implement rate limiting
- [ ] Monitor program usage
- [ ] Set up error logging

## Post-Deployment

### Monitor Your Program
```bash
solana program show YOUR_PROGRAM_ID
```

### Check Program Balance
```bash
solana balance YOUR_PROGRAM_ID
```

### Upgrade Program (if needed)
```bash
solana program deploy --program-id YOUR_PROGRAM_ID target/deploy/certificate_verification.so
```

## Cost Estimate

**Mainnet Costs:**
- Program deployment: ~1-5 SOL (one-time)
- Certificate issuance: ~0.001-0.002 SOL per certificate
- Storage: Depends on data size

**Tips to Reduce Costs:**
- Optimize data structures
- Use PDAs efficiently
- Batch operations when possible

## Support & Maintenance

1. **Monitor transactions** regularly
2. **Keep dependencies updated**
3. **Backup keypairs** securely
4. **Document all changes**
5. **Test before deploying updates**

## Rollback Plan

If you need to rollback:
```bash
# Deploy previous version
solana program deploy --program-id YOUR_PROGRAM_ID path/to/old/version.so
```

## Additional Resources

- [Solana Docs](https://docs.solana.com)
- [Phantom Wallet](https://phantom.app)
- [Solana Explorer](https://explorer.solana.com)
