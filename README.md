# DeFi Vault Deployment Guide

## Backend (Smart Contracts)

### 1. Environment Setup
Create `.env` file in Backend directory:
```
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
```

### 2. Deploy Vault Contract
```bash
cd Backend
node scripts/deploy-with-artifacts.js
```

### 3. Update Frontend Configuration
After deployment, update `VAULT_ADDRESS` in `Frontend/blockchain/contracts.js` with the deployed vault address.

## Frontend

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Application
Open `http://localhost:5174` in your browser.

## Deposit Flow Testing

1. **Connect Wallet**: Click "Connect Wallet" in top right
2. **Navigate to Deposit**: Click "Deposit" in navigation
3. **Enter Amount**: Input USDC amount or click "MAX"
4. **Approve & Deposit**: Click "Deposit" button
5. **MetaMask Transactions**: 
   - First transaction: Approve USDC spending
   - Second transaction: Deposit to vault
6. **Success**: View transaction on Etherscan

## Smart Contract Details

### Vault Contract Features:
- ✅ Accept USDC deposits
- ✅ Track user balances
- ✅ Allow full withdrawals
- ✅ No fees
- ✅ No yield logic (v1)
- ✅ No admin functions

### Contract Address:
- Update `VAULT_ADDRESS` in `Frontend/blockchain/contracts.js` after deployment

## Testnet Details

- **Network**: Sepolia Testnet
- **USDC Token**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **Faucet**: Get Sepolia ETH from [sepoliafaucet.com](https://sepoliafaucet.com)
- **Explorer**: [sepolia.etherscan.io](https://sepolia.etherscan.io)

## Important Notes

- Ensure you have Sepolia ETH for gas fees
- Contract uses 6 decimal places for USDC
- All transactions are on Sepolia testnet
- No real money involved - testnet only
