# 🏦 Strata: DeFi Yield Vault Platform

## 🎯 Project Overview

**Strata** is a decentralized finance (DeFi) platform that allows users to deposit cryptocurrency into automated vaults that generate yield through the Aave protocol. Built on Ethereum Sepolia testnet, Strata provides a secure, transparent, and user-friendly interface for earning passive income on digital assets.

### 🌟 Key Features
- **🔒 Secure Vault Contracts**: Audited smart contracts with built-in security
- **💰 Real Yield Generation**: Integration with Aave V3 protocol for competitive yields
- **🎛️ User-Friendly Interface**: Modern React frontend with real-time balance tracking
- **📊 Portfolio Dashboard**: Track deposits, yields, and total portfolio value
- **🔄 Flexible Withdrawals**: Withdraw principal plus accrued yield anytime
- **🧪 Testnet Ready**: Fully functional on Sepolia testnet with no real money required

### 🏗️ Architecture
- **Backend**: Solidity smart contracts with Hardhat development framework
- **Frontend**: React + Vite with ethers.js for blockchain interaction
- **Blockchain**: Ethereum Sepolia testnet with Aave V3 integration
- **Infrastructure**: Alchemy RPC endpoints for reliable blockchain access

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MetaMask browser extension
- Sepolia ETH for gas fees (get from faucet)

### 📋 Setup Steps

1. **Clone & Install**
```bash
git clone <repository-url>
cd Strata
```

2. **Backend Setup**
```bash
cd Backend
npm install
```

3. **Frontend Setup**
```bash
cd Frontend
npm install
```

4. **Configure Environment**
   - Create `.env` in Backend directory
   - Add your private key and RPC URL

5. **Deploy Contracts**
```bash
cd Backend
node scripts/deploy-real-aave.js
```

6. **Start Frontend**
```bash
cd Frontend
npm run dev
```

7. **Access Application**
   - Open `http://localhost:5174`
   - Connect wallet and start earning!

---

## 💰 Supported Tokens

### 🪙 Current Integration
- **DAI** (`0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`)
  - ✅ Fully integrated with Aave Sepolia
  - ✅ Available via Aave faucet
  - ✅ Stablecoin with reliable yields

### 🔮 Future Tokens
- **WETH**: Wrapped Ethereum for higher yields
- **USDT**: Tether for stablecoin diversity
- **WBTC**: Wrapped Bitcoin for crypto exposure

### 📖 Token Guide
See `HOW_TO_GET_TOKENS.md` for detailed instructions on obtaining test tokens.

---

## 🏦 Vault Features

### 📋 Core Functionality
- **✅ Secure Deposits**: Non-custodial vault with user-controlled funds
- **✅ Real Yield**: Automatic supply to Aave V3 protocol
- **✅ Interest Tracking**: Real-time yield calculation and display
- **✅ Flexible Withdrawals**: Withdraw principal + accrued yield anytime
- **✅ Transparent**: All transactions visible on blockchain
- **✅ Gas Optimized**: Efficient contract interactions

### 🛡️ Security Features
- **✅ Reentrancy Protection**: Prevents recursive attacks
- **✅ Access Control**: Proper ownership and permission management
- **✅ Input Validation**: Comprehensive error handling
- **✅ Emergency Controls**: Safe withdrawal mechanisms

---

## 📊 User Experience

### 🎯 Deposit Flow
1. **Connect Wallet**: Secure MetaMask integration
2. **Select Token**: Choose from supported assets
3. **Enter Amount**: Specify deposit amount
4. **Approve Token**: Grant vault spending permission
5. **Confirm Deposit**: Execute transaction
6. **Track Yield**: Monitor real-time earnings

### 📈 Dashboard Features
- **Portfolio Overview**: Total value and earnings
- **Transaction History**: Complete deposit/withdrawal record
- **Yield Analytics**: Real-time APY and earnings breakdown
- **Wallet Management**: Multi-token balance display

---

## 🛠️ Technical Details

### 🔧 Smart Contracts
- **VaultV2RealAave.sol**: Main vault contract with Aave integration
- **IPool Interface**: Aave V3 pool interaction
- **ERC20 Integration**: Standard token compatibility
- **Hardhat Framework**: Development and deployment

### 🌐 Frontend Technology
- **React 18**: Modern component-based UI
- **Vite**: Fast development and build tool
- **ethers.js**: Ethereum blockchain interaction
- **Tailwind CSS**: Responsive design system
- **MetaMask Integration**: Wallet connectivity

### 🔗 Blockchain Integration
- **Network**: Ethereum Sepolia Testnet
- **Protocol**: Aave V3 Lending Protocol
- **RPC**: Alchemy Infrastructure
- **Gas**: Optimized transaction costs

---

## 📋 Deployment Guide

### 🏗️ Backend (Smart Contracts)

#### 1. Environment Setup
Create `.env` file in Backend directory:
```env
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here
```

#### 2. Deploy Vault Contract
```bash
cd Backend
node scripts/deploy-real-aave.js
```

#### 3. Update Frontend Configuration
After deployment, update `VAULT_V2_ADDRESS` in `Frontend/blockchain/contracts.js` with the deployed vault address.

### 🎨 Frontend

#### 1. Install Dependencies
```bash
cd Frontend
npm install
```

#### 2. Start Development Server
```bash
npm run dev
```

#### 3. Access Application
Open `http://localhost:5174` in your browser.

---

## 🧪 Testing & Development

### 📝 Test Coverage
- **Unit Tests**: Smart contract functions
- **Integration Tests**: Frontend-backend interaction
- **E2E Tests**: Complete user flows
- **Security Tests**: Vulnerability scanning

### 🔍 Debugging Tools
- **Hardhat Console**: Contract interaction testing
- **Etherscan**: Transaction verification
- **MetaMask**: Wallet debugging
- **Browser DevTools**: Frontend inspection

---

## 📚 Documentation

### 📖 Available Guides
- `HOW_TO_GET_TOKENS.md`: Complete token acquisition guide
- `CONTRACTS.md`: Smart contract documentation
- `API.md`: Frontend API reference

### 🔗 Useful Links
- **Aave Documentation**: https://docs.aave.com/
- **Sepolia Faucet**: https://sepolia.faucet.aave.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io/

---

## 🚨 Important Notes

### ⚠️ Testnet Only
- **No Real Money**: All transactions use testnet tokens
- **Free Testing**: Tokens available from faucets
- **Educational Purpose**: Learn DeFi concepts safely

### 🔐 Security Considerations
- **Never Share Private Keys**: Keep your keys secure
- **Verify Transactions**: Always check MetaMask prompts
- **Use Testnet**: Never use mainnet without proper testing

### 💡 Gas Fees
- **Sepolia ETH Required**: Need test ETH for transactions
- **Gas Optimization**: Contracts designed for efficiency
- **Fee Estimation**: Built-in gas calculation

---

## 🤝 Contributing

### 📋 Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

### 🐛 Bug Reports
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide environment details

---

## 📞 Support & Contact

### 🆘 Getting Help
- **Documentation**: Check all `.md` files first
- **Issues**: Search existing GitHub issues
- **Community**: Join our Discord/Telegram
- **Direct**: Contact development team

### 📧 Contact Information
- **GitHub Issues**: For technical problems
- **Discord**: For community support
- **Email**: For business inquiries

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Acknowledgments

- **Aave Protocol**: For the lending infrastructure
- **Ethereum Foundation**: For Sepolia testnet
- **OpenZeppelin**: For secure contract libraries
- **Hardhat Team**: For development framework
- **React Community**: For frontend tools

---

*Last updated: February 2026*
*Version: 2.0 - Real Aave Integration*
*Status: Production Ready (Testnet)*
