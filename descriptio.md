# 🏦 Strata DeFi Vault Platform

## 📋 Project Overview

Strata is a decentralized finance (DeFi) platform that enables users to earn passive income through automated yield generation vaults integrated with the Aave protocol. Built on Ethereum Sepolia testnet, Strata provides a secure, user-friendly interface for cryptocurrency deposits and yield farming.

### 🎯 Mission
Democratize access to sophisticated DeFi yield strategies through a simple, secure, and transparent platform.

### 🌟 Key Features
- **🔒 Secure Vault Contracts**: Non-custodial smart contracts with built-in security
- **💰 Real Yield Generation**: Integration with Aave V3 for competitive yields
- **🎛️ User-Friendly Interface**: Modern React frontend with real-time tracking
- **📊 Portfolio Dashboard**: Track deposits, yields, and portfolio value
- **🔄 Flexible Withdrawals**: Withdraw principal + accrued yield anytime
- **🧪 Testnet Ready**: Fully functional on Sepolia with no real money required

---

## 🏗️ Technical Architecture

### Backend (Smart Contracts)
- **Solidity ^0.8.20**: Smart contract development
- **Hardhat Framework**: Testing, deployment, and management
- **OpenZeppelin Libraries**: Security and standard implementations
- **Aave V3 Integration**: Direct protocol integration for lending

### Frontend
- **React 18**: Modern component-based UI framework
- **Vite**: Fast development and optimized builds
- **ethers.js**: Ethereum blockchain interaction
- **Tailwind CSS**: Responsive design system
- **MetaMask Integration**: Wallet connectivity

### Blockchain Integration
- **Network**: Ethereum Sepolia Testnet
- **Protocol**: Aave V3 Lending Protocol
- **RPC**: Alchemy Infrastructure endpoints
- **Gas Optimization**: Efficient contract interactions

---

## 💰 Supported Tokens

### Current Integration
- **DAI** (`0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`)
  - ✅ Fully integrated with Aave Sepolia
  - ✅ Available via Aave faucet
  - ✅ Stablecoin with reliable yields

### Future Tokens
- **WETH**: Wrapped Ethereum for higher yields
- **USDT**: Tether for stablecoin diversity
- **WBTC**: Wrapped Bitcoin for crypto exposure

---

## 🏦 Vault Features

### Core Functionality
- **✅ Secure Deposits**: Non-custodial vault with user control
- **✅ Real Yield**: Automatic supply to Aave V3 protocol
- **✅ Interest Tracking**: Real-time yield calculation
- **✅ Flexible Withdrawals**: Withdraw principal + yield anytime
- **✅ Transparent**: All transactions visible on blockchain
- **✅ Gas Optimized**: Efficient contract interactions

### Security Features
- **✅ Reentrancy Protection**: Prevents recursive attacks
- **✅ Access Control**: Proper ownership and permissions
- **✅ Input Validation**: Comprehensive error handling
- **✅ Emergency Controls**: Safe withdrawal mechanisms

---

## 📊 User Experience

### Deposit Flow
1. **Connect Wallet**: Secure MetaMask integration
2. **Select Token**: Choose from supported assets
3. **Enter Amount**: Specify deposit amount
4. **Approve Token**: Grant vault spending permission
5. **Confirm Deposit**: Execute transaction
6. **Track Yield**: Monitor real-time earnings

### Dashboard Features
- **Portfolio Overview**: Total value and earnings
- **Transaction History**: Complete deposit/withdrawal record
- **Yield Analytics**: Real-time APY and earnings breakdown
- **Wallet Management**: Multi-token balance display

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ installed
- MetaMask browser extension
- Sepolia ETH for gas fees

### Installation Steps

1. **Clone Repository**
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

4. **Environment Configuration**
Create `.env` in Backend directory:
```env
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here
```

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
Open `http://localhost:5174` in browser

---

## 📚 Documentation

### Available Guides
- `README.md`: Complete project documentation
- `HOW_TO_GET_TOKENS.md`: Token acquisition guide
- `DESCRIPTION.md`: Business and technical details
- `CONTRACTS.md`: Smart contract documentation

### Important Links
- **Aave Documentation**: https://docs.aave.com/
- **Sepolia Faucet**: https://sepolia.faucet.aave.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io/

---

## 🚀 Quick Start Guide

### For Users
1. **Get Test Tokens**: Visit Aave faucet for DAI
2. **Connect Wallet**: Connect MetaMask to Sepolia
3. **Deposit Tokens**: Deposit DAI into vault
4. **Earn Yield**: Automatically earn through Aave
5. **Withdraw Anytime**: Withdraw principal + yield

### For Developers
1. **Review Code**: Examine smart contracts and frontend
2. **Run Tests**: Test all functionality locally
3. **Deploy to Sepolia**: Deploy contracts to testnet
4. **Test Integration**: Verify Aave integration
5. **Contribute**: Submit pull requests

---

## 🔍 Contract Details

### VaultV2RealAave.sol
- **Purpose**: Main vault contract with Aave integration
- **Features**: Deposit, withdraw, yield tracking
- **Security**: Reentrancy protection, access controls
- **Integration**: Direct Aave V3 pool interaction

### Key Addresses (Sepolia)
- **DAI Token**: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- **Aave Pool**: `0x6Ae43d5257286e850D7572924237F96BdC3d9eA6`
- **aDAI Token**: `0x00000000000000000299E1616d458215Bb2f7CC8`
- **Vault Contract**: Deployed via script

---

## 🧪 Testing & Development

### Test Coverage
- **Unit Tests**: Smart contract functions
- **Integration Tests**: Frontend-backend interaction
- **E2E Tests**: Complete user flows
- **Security Tests**: Vulnerability scanning

### Development Tools
- **Hardhat Console**: Contract interaction testing
- **Etherscan**: Transaction verification
- **MetaMask**: Wallet debugging
- **Browser DevTools**: Frontend inspection

---

## 🚨 Important Notes

### Testnet Only
- **No Real Money**: All transactions use testnet tokens
- **Free Testing**: Tokens available from faucets
- **Educational Purpose**: Learn DeFi concepts safely

### Security Considerations
- **Never Share Private Keys**: Keep keys secure
- **Verify Transactions**: Check MetaMask prompts
- **Use Testnet**: Never use mainnet without testing

### Gas Fees
- **Sepolia ETH Required**: Need test ETH for transactions
- **Gas Optimization**: Contracts designed for efficiency
- **Fee Estimation**: Built-in gas calculation

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

### Bug Reports
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide environment details

---

## 📞 Support & Contact

### Getting Help
- **Documentation**: Check all `.md` files first
- **Issues**: Search existing GitHub issues
- **Community**: Join Discord/Telegram
- **Direct**: Contact development team

### Contact Information
- **GitHub Issues**: For technical problems
- **Discord**: For community support
- **Email**: For business inquiries

---

## 📜 License

This project is licensed under the MIT License.

---

## 🎉 Acknowledgments

- **Aave Protocol**: For lending infrastructure
- **Ethereum Foundation**: For Sepolia testnet
- **OpenZeppelin**: For secure contract libraries
- **Hardhat Team**: For development framework
- **React Community**: For frontend tools

---

*Last updated: February 2026*
*Version: 2.0 - Real Aave Integration*
*Status: Production Ready (Testnet)*
