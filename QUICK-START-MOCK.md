# Quick Setup - Use Mock Program ID for Testing

Since Solana CLI installation is having issues, here's how to test the UI immediately:

## Use This Valid Base58 Mock Program ID:

```
9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin
```

**Note:** This is a valid Base58-encoded string (Solana format). It won't actually exist on the blockchain, but allows the UI to load without errors.

## Update These Files:

### 1. frontend/src/components/IssueCertificate.tsx
Find line ~37 and replace:
```typescript
const PROGRAM_ID = new PublicKey("REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT");
```

With:
```typescript
const PROGRAM_ID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
```

### 2. frontend/src/components/RevokeCertificate.tsx
Find line ~31 and replace:
```typescript
const PROGRAM_ID = new PublicKey("REPLACE_WITH_YOUR_PROGRAM_ID_AFTER_DEPLOYMENT");
```

With:
```typescript
const PROGRAM_ID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
```

## Then Run:
```powershell
cd frontend
npm run dev
```

Open: http://localhost:3000

**Note:** This mock ID allows the UI to load and display properly. For actual blockchain functionality, you'll need to deploy the real Solana program using the DEPLOYMENT-GUIDE.md instructions.

## For Real Deployment:

Use **Solana Playground** (easiest, no installation):
1. Go to: https://beta.solpg.io
2. Create new project
3. Copy code from `solana-program/src/lib.rs`
4. Click "Build" then "Deploy"
5. Get your real Program ID
6. Update the frontend files with the real ID
