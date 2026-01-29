// Web3 utilities and helper functions
import { ethers } from 'ethers';

export class Web3Utils {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
  }

  // Initialize Web3 connection
  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Create provider and signer
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.userAddress = await this.signer.getAddress();

    // Check if we're on the correct network
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== 11155111) { // Sepolia
      throw new Error('Please connect to Sepolia testnet');
    }

    return {
      provider: this.provider,
      signer: this.signer,
      userAddress: this.userAddress
    };
  }

  // Switch to Sepolia network
  async switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  // Format USDC amount (6 decimals)
  formatUSDC(amount) {
    return ethers.formatUnits(amount, 6);
  }

  // Parse USDC amount (6 decimals)
  parseUSDC(amount) {
    return ethers.parseUnits(amount.toString(), 6);
  }

  // Get user's USDC balance
  async getUSDCBalance(usdcContract) {
    if (!this.userAddress) {
      throw new Error('Wallet not connected');
    }
    return await usdcContract.balanceOf(this.userAddress);
  }

  // Get user's vault balance
  async getVaultBalance(vaultContract) {
    if (!this.userAddress) {
      throw new Error('Wallet not connected');
    }
    return await vaultContract.getUserBalance(this.userAddress);
  }

  // Wait for transaction confirmation
  async waitForTransaction(txHash, timeout = 60000) {
    const receipt = await this.provider.waitForTransaction(txHash, 1, timeout);
    if (!receipt) {
      throw new Error('Transaction confirmation timeout');
    }
    return receipt;
  }

  // Get transaction URL on Etherscan
  getEtherscanUrl(txHash) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }
}

// Create singleton instance
export const web3Utils = new Web3Utils();
