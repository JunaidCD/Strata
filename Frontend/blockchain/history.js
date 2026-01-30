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
    // Use browser provider for getting signer
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      // Fallback to read-only provider
      this.provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/IIlDUJE7IyZMGuPA5wDTPDAv_2FrgPhf');
    }
    this.vaultContract = getVaultContract(this.provider);
  }

  // Get transaction history from blockchain events
  async getTransactionHistory(userAddress) {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      console.log('🔍 Fetching transaction history for:', userAddress);

      // Get the full address from the connected wallet
      const signer = await this.provider.getSigner();
      const fullAddress = await signer.getAddress();
      console.log('📍 Full address for events:', fullAddress);

      // Create filters for the specific user
      const depositFilter = this.vaultContract.filters.Deposited(fullAddress);
      const withdrawFilter = this.vaultContract.filters.Withdrawn(fullAddress);
      
      console.log('📋 Deposit filter:', depositFilter);
      console.log('📋 Withdraw filter:', withdrawFilter);

      // Get events for the specific user
      const depositEvents = await this.vaultContract.queryFilter(depositFilter, -10000);
      const withdrawEvents = await this.vaultContract.queryFilter(withdrawFilter, -10000);

      console.log('📊 Found deposit events:', depositEvents.length);
      console.log('📊 Found withdraw events:', withdrawEvents.length);

      // Filter additional safety - ensure events belong to the user
      const userDepositEvents = depositEvents.filter(event => 
        event.args && event.args.user && 
        event.args.user.toLowerCase() === fullAddress.toLowerCase()
      );
      
      const userWithdrawEvents = withdrawEvents.filter(event => 
        event.args && event.args.user && 
        event.args.user.toLowerCase() === fullAddress.toLowerCase()
      );

      console.log('📊 Filtered deposit events:', userDepositEvents.length);
      console.log('📊 Filtered withdraw events:', userWithdrawEvents.length);

      // Combine and format events
      const allEvents = [...userDepositEvents, ...userWithdrawEvents];
      
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

      console.log('📊 Formatted transactions:', transactions.length);
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
