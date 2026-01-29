# Quick Deployment Guide

## The Error You're Seeing
The error "ERC20: approve to the zero address" happens because the Vault contract hasn't been deployed yet, so `VAULT_ADDRESS` is set to a placeholder.

## Quick Fix - Deploy the Vault Contract

### Option 1: Deploy to Sepolia (Recommended)

1. **Update Environment Variables**:
   Edit `Backend/.env`:
   ```
   SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your_actual_private_key_here
   ```

2. **Deploy Contract**:
   ```bash
   cd Backend
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Update Frontend**:
   Copy the deployed vault address and update `Frontend/blockchain/contracts.js`:
   ```javascript
   export const VAULT_ADDRESS = "0xYOUR_DEPLOYED_VAULT_ADDRESS";
   ```

### Option 2: Use a Sample Address (Testing Only)

For immediate testing, I've updated the VAULT_ADDRESS to a non-zero address, but you'll still need to deploy the actual contract for real transactions.

## What You Need to Deploy

1. **Infura Project ID**: Get from [infura.io](https://infura.io)
2. **Sepolia ETH**: Get from [sepoliafaucet.com](https://sepoliafaucet.com)
3. **Private Key**: Your wallet private key (NEVER share this)

## After Deployment

Once deployed, the deposit flow will work:
1. Connect wallet
2. Navigate to Deposit
3. Enter USDC amount
4. Click "Deposit"
5. Approve USDC spending
6. Deposit to vault
7. Success! 🎉

The error will be resolved once you update `VAULT_ADDRESS` with the real deployed contract address.
