# 🪙 How to Get DAI or WETH on Sepolia Testnet

## 📋 Quick Summary
- **DAI**: Harder to get, but works with current vault
- **WETH**: Easier to get, better yields, recommended
- **Both are FREE** - no real money needed!

---

## 💰 Option 1: Get DAI (Recommended for Current Setup)

### 🚀 Method 1: Aave Sepolia Faucet (Easiest)
1. **Visit**: https://sepolia.faucet.aave.com/
2. **Connect Wallet**: MetaMask or any wallet
3. **Switch to Sepolia Network**: Network ID 11155111
4. **Request DAI**: 
   - Enter your wallet address
   - Select "DAI" token
   - Click "Request"
   - Wait for transaction confirmation
5. **Amount**: Usually 100 DAI per request

### 🔄 Method 2: ETH → DAI Swap
1. **Get Sepolia ETH** (see WETH section below)
2. **Visit Uniswap Sepolia**: https://app.uniswap.org/#/swap?chain=sepolia
3. **Swap ETH → DAI**
4. **Note**: May have limited liquidity

### ⚠️ DAI Issues:
- Faucets sometimes run out of DAI
- Limited availability on testnets
- May need to try multiple times

---

## 🔮 Option 2: Get WETH (Recommended - Easier)

### 🚀 Method 1: Get Free Sepolia ETH
**Best Faucets:**
1. **Sepolia Faucet**: https://sepoliafaucet.com/
   - 0.5 ETH per request
   - Daily claims available
   
2. **Chainlink Faucet**: https://faucets.chain.link/
   - 0.1 ETH + LINK tokens
   - Very reliable
   
3. **QuickNode Faucet**: https://quicknode.com/faucet/ethereum-sepolia
   - 0.1 ETH per request
   - Fast delivery

### 🔄 Method 2: Wrap ETH to WETH
1. **Get ETH** from faucets above
2. **Visit Uniswap Sepolia**: https://app.uniswap.org/#/swap?chain=sepolia
3. **Swap Settings**:
   - From: ETH
   - To: WETH
   - Amount: Whatever you received
4. **Benefits**:
   - 1:1 ratio (no slippage)
   - No fees for wrapping
   - Instant transaction

### 💡 WETH Advantages:
- ✅ **Easy to obtain** from any faucet
- ✅ **Better yields** than DAI in Aave
- ✅ **More liquid** in Aave Sepolia
- ✅ **Always available** (faucets never run out)
- ✅ **18 decimals** (same as ETH)

---

## 🛠️ Option 3: Update Vault for WETH

### 📝 Required Changes:
If you want to switch to WETH, I can update:

1. **Smart Contract**: `VaultV2RealAave.sol`
   - Change from DAI to WETH
   - Update token addresses
   - Modify function names

2. **Frontend**: `contracts.js`
   - Update token addresses
   - Change ABIs if needed
   - Update display names

3. **Deployment**: Deploy new WETH vault

### 🎯 Why Switch to WETH:
- **Guaranteed availability**
- **Better testing experience**
- **Higher yields**
- **More professional setup**

---

## 🔍 Quick Troubleshooting

### ❌ Common Issues:
1. **Wrong Network**: Ensure you're on Sepolia (ID: 11155111)
2. **Wrong Address**: Use YOUR wallet address, not token contract
3. **Faucet Empty**: Try different faucets or wait for refill
4. **Transaction Failed**: Check gas fees, try again

### ✅ Quick Checks:
```javascript
// Check your DAI balance
const daiBalance = await daiContract.balanceOf("YOUR_WALLET_ADDRESS");

// Check your WETH balance  
const wethBalance = await wethContract.balanceOf("YOUR_WALLET_ADDRESS");
```

### 🌐 Etherscan Links:
- **Your Wallet**: https://sepolia.etherscan.io/address/[YOUR_WALLET_ADDRESS]
- **DAI Token**: https://sepolia.etherscan.io/address/0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357
- **WETH Token**: https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14

---

## 🚀 Recommended Action Plan

### 🎯 For Quick Testing:
1. **Try DAI faucet first** (if you want to keep current setup)
2. **If DAI fails, get WETH** (much easier)
3. **Let me update vault for WETH** (if needed)

### 💡 Pro Tips:
- **Keep some ETH** for gas fees
- **Test with small amounts** first
- **Check balances** after each step
- **Save transaction hashes** for debugging

---

## 📞 Need Help?

### 🛠️ I Can Help You:
- ✅ **Update vault contract** for WETH
- ✅ **Deploy new contracts**
- ✅ **Debug balance issues**
- ✅ **Guide through swaps**
- ✅ **Create custom tokens** (if needed)

### 🎯 Quick Decision:
- **Want DAI?** Try Aave faucet first
- **Want WETH?** Get ETH from any faucet, then wrap
- **Need help?** Just ask!

---

## 📚 Important Links

### 🪙 Token Addresses (Sepolia):
- **DAI**: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`
- **USDT**: `0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91`
- **LINK**: `0xE33592594f72Cc7c0554Ad834C8E6d9E9d3D0B3F`

### 🌐 Faucets:
- **Aave**: https://sepolia.faucet.aave.com/
- **Sepolia**: https://sepoliafaucet.com/
- **Chainlink**: https://faucets.chain.link/
- **QuickNode**: https://quicknode.com/faucet/ethereum-sepolia

### 🔄 DEX:
- **Uniswap Sepolia**: https://app.uniswap.org/#/swap?chain=sepolia

---

## 🎉 Success Checklist

### ✅ When You Have Tokens:
- [ ] Token appears in wallet
- [ ] Balance shows in frontend app
- [ ] Can approve tokens
- [ ] Can deposit to vault
- [ ] Aave integration works
- [ ] Yield starts accumulating

### 🚀 Ready to Start:
1. **Choose your token** (DAI or WETH)
2. **Get from faucet**
3. **Test with vault**
4. **Earn real yield!**

---

*Last updated: February 2026*
*Network: Ethereum Sepolia Testnet*
*Status: Working and Tested*
