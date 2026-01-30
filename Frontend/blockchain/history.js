// Transaction history service for reading blockchain events
import { ethers } from 'ethers';
import { web3Utils } from './web3.js';
import { VAULT_ADDRESS, getVaultContract } from './contracts.js';

export class TransactionHistoryService {
  constructor() {
    this.provider = null;
    this.vaultContract = null;
  }

  // Initialize service with provider
  async initialize() {
    this.provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/IIlDUJE7IyZMGuPA5wDTPDAv_2FrgPhf');
    this.vaultContract = getVaultContract(this.provider);
  }

  // Get transaction history from blockchain events
  async getTransactionHistory(userAddress) {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      console.log('🔍 Fetching transaction history for:', userAddress);

      // Get deposit events
      const depositEvents = await this.vaultContract.queryFilter(
        this.vaultContract.filters.Deposited(userAddress),
        -10000 // Last 10000 blocks
      );

      // Get withdraw events
      const withdrawEvents = await this.vaultContract.queryFilter(
        this.vaultContract.filters.Withdrawn(userAddress),
        -10000 // Last 10000 blocks
      );

      // Combine and format events
      const allEvents = [...depositEvents, ...withdrawEvents];
      
      // Sort by timestamp (newest first)
      const sortedEvents = allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

      // Format for UI
      const transactions = sortedEvents.map((event, index) => {
        const isDeposit = event.event === 'Deposited';
        const amount = web3Utils.formatUSDC(event.args.amount);
        
        return {
          id: index + 1,
          type: isDeposit ? 'Deposit' : 'Withdraw',
          amount: parseFloat(amount).toFixed(2),
          token: 'USDC',
          status: 'Confirmed',
          time: this.formatTimestamp(event.blockNumber),
          txHash: event.transactionHash,
          etherscanUrl: `https://sepolia.etherscan.io/tx/${event.transactionHash}`
        };
      });

      console.log('📊 Found transactions:', transactions.length);
      return transactions;

    } catch (error) {
      console.error('❌ Error fetching transaction history:', error);
      return [];
    }
  }

  // Format block timestamp to relative time
  formatTimestamp(blockNumber) {
    // For now, return a simple format. In production, you'd fetch the actual block timestamp
    const now = Date.now();
    const blockTime = 12000; // ~12 seconds per block on Sepolia
    const blocksAgo = 1000; // Approximate blocks ago for demo
    
    const eventTime = now - (blocksAgo * blockTime);
    const timeAgo = now - eventTime;
    
    const minutes = Math.floor(timeAgo / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // Get real block timestamp (more accurate but slower)
  async getBlockTimestamp(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return new Date(block.timestamp * 1000);
    } catch (error) {
      console.error('Error fetching block timestamp:', error);
      return new Date();
    }
  }
}

// Create singleton instance
export const transactionHistoryService = new TransactionHistoryService();
