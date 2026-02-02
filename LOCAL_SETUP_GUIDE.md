# Vault v2 - Local Setup & Run Commands

## 🚀 Quick Start Commands

### 1. Backend Setup & Deployment

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Deploy Vault v2 with Aave integration
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# Test Aave integration
npx hardhat run scripts/test-aave-integration.js --network sepolia
```

### 2. Frontend Setup & Run

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm start

# Alternative: Start with specific port
npm start -- --port 3000
```

### 3. Complete Setup (One-Time)

```bash
# Backend Setup
cd Backend
npm install
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# Frontend Setup
cd ../Frontend
npm install
npm start
```

## 📋 Detailed Setup Commands

### Prerequisites

```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Install MetaMask browser extension
# https://metamask.io/

# Get Sepolia testnet ETH
# https://sepoliafaucet.com/
```

### Backend Commands

```bash
# 1. Navigate to Backend
cd Backend

# 2. Install dependencies
npm install

# 3. Compile contracts
npx hardhat compile

# 4. Deploy Vault v2
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# 5. Run integration tests
npx hardhat run scripts/test-aave-integration.js --network sepolia

# 6. Verify deployment (optional)
npx hardhat verify <VAULT_ADDRESS> <USDC_ADDRESS> <AAVE_POOL_ADDRESS> --network sepolia
```

### Frontend Commands

```bash
# 1. Navigate to Frontend
cd Frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Alternative start commands
npm run dev
# or
yarn start
# or
yarn dev
```

## 🔧 Environment Setup

### Backend Environment Variables

Create `.env` file in Backend directory:

```bash
# Backend/.env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### Frontend Environment Variables

Create `.env` file in Frontend directory:

```bash
# Frontend/.env
REACT_APP_SEPOLIA_NETWORK_ID=11155111
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

## 🌐 Network Configuration

### MetaMask Setup

1. **Add Sepolia Network**:
   - Network Name: Sepolia Testnet
   - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer URL: https://sepolia.etherscan.io

2. **Import Account**:
   - Use the same private key from your `.env` file
   - Ensure account has Sepolia ETH for gas fees

## 🧪 Testing Commands

### Backend Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/VaultV2.test.js

# Run integration test
npx hardhat run scripts/test-aave-integration.js --network sepolia

# Run with gas reporting
npx hardhat test --report-gas
```

### Frontend Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- --testNamePattern="Vault"
```

## 📊 Development Workflow

### Daily Development Commands

```bash
# 1. Start Backend (in terminal 1)
cd Backend
npm run compile
npx hardhat node  # Local hardhat node

# 2. Deploy to Local Network (in terminal 2)
cd Backend
npx hardhat run scripts/deploy-vault-v2.js --network localhost

# 3. Start Frontend (in terminal 3)
cd Frontend
npm start
```

### Production-like Testing

```bash
# 1. Deploy to Sepolia
cd Backend
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# 2. Update frontend with new contract address
# (contracts.js automatically uses deployed address)

# 3. Start frontend
cd Frontend
npm start
```

## 🔍 Debugging Commands

### Contract Debugging

```bash
# Verify contract on Etherscan
npx hardhat verify <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS> --network sepolia

# Check contract deployment
npx hardhat run scripts/check-deployment.js --network sepolia

# Interact with contract directly
npx hardhat console --network sepolia
```

### Frontend Debugging

```bash
# Start with debug logging
DEBUG=true npm start

# Start with specific port
PORT=3001 npm start

# Clear cache and start
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🚀 Quick Deploy & Run

### One-Command Setup

```bash
# Clone and setup everything
git clone <repository-url>
cd Strata

# Backend setup
cd Backend
npm install
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# Frontend setup
cd ../Frontend
npm install
npm start
```

### Test Everything Works

```bash
# 1. Check contract deployment
cd Backend
npx hardhat run scripts/test-aave-integration.js --network sepolia

# 2. Start frontend
cd ../Frontend
npm start

# 3. Open browser to http://localhost:3000
# 4. Connect MetaMask to Sepolia
# 5. Test deposit and withdraw functionality
```

## 📱 Access Points

### Frontend Application
- **URL**: http://localhost:3000
- **Deposit Page**: http://localhost:3000/deposit
- **Withdraw Page**: http://localhost:3000/withdraw
- **Dashboard**: http://localhost:3000/dashboard

### Contract Addresses (Sepolia)
- **Vault v2**: Check deployment-info-v2.json
- **USDC Token**: 0xA17201d0E98437862E0d9eDFc1D57d2d725cB939
- **Aave Pool**: 0x6Ae43d5257286e850D7572924237F96BdC3d9eA6
- **aUSDC**: 0x5414bD0882B4646B5A778350B1c84AB69e627735

## 🔧 Common Issues & Solutions

### MetaMask Connection Issues

```bash
# Reset MetaMask connection
# 1. Disconnect site in MetaMask
# 2. Clear browser cache
# 3. Restart frontend: npm start
```

### Contract Deployment Issues

```bash
# Check gas price and network
npx hardhat run scripts/check-network.js --network sepolia

# Redeploy with higher gas
npx hardhat run scripts/deploy-vault-v2.js --network sepolia --gas-price 20000000000
```

### Frontend Build Issues

```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

## 📞 Support Commands

### Get Help

```bash
# Check Hardhat version
npx hardhat --version

# Check Node.js version
node --version

# Check npm version
npm --version

# List available Hardhat tasks
npx hardhat help
```

### Reset Everything

```bash
# Complete reset
cd Backend
rm -rf node_modules package-lock.json artifacts cache
npm install
npx hardhat clean
npx hardhat compile

cd ../Frontend
rm -rf node_modules package-lock.json build
npm install
npm start
```

---

## 🎯 Summary

Run these commands to get Vault v2 with Aave working locally:

```bash
# 1. Setup Backend
cd Backend
npm install
npx hardhat run scripts/deploy-vault-v2.js --network sepolia

# 2. Setup Frontend  
cd ../Frontend
npm install
npm start

# 3. Open http://localhost:3000
# 4. Connect MetaMask to Sepolia
# 5. Test deposit/withdraw with real yield!
```

That's it! Your Vault v2 with Aave integration will be running locally with real yield generation. 🚀
