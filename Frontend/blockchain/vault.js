// Vault service for handling deposit operations
import { ethers } from 'ethers';
import { web3Utils } from './web3.js';
import { USDC_ADDRESS, VAULT_ADDRESS, getUSDCContract, getVaultContract } from './contracts.js';

export class VaultService {
  constructor() {
    this.usdcContract = null;
    this.vaultContract = null;
  }

  // Initialize contracts after wallet connection
  async initialize() {
    const { provider, signer } = await web3Utils.initialize();
    
    // Initialize contracts with signer for transactions
    this.usdcContract = getUSDCContract(signer);
    this.vaultContract = getVaultContract(signer);
    
    return {
      usdcContract: this.usdcContract,
      vaultContract: this.vaultContract
    };
  }

  // Get USDC balance
  async getUSDCBalance() {
    if (!this.usdcContract) {
      await this.initialize();
    }
    const balance = await web3Utils.getUSDCBalance(this.usdcContract);
    return web3Utils.formatUSDC(balance);
  }

  // Get vault balance
  async getVaultBalance() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    const balance = await web3Utils.getVaultBalance(this.vaultContract);
    return web3Utils.formatUSDC(balance);
  }

  // Check USDC allowance for vault
  async getUSDCAllowance(amount) {
    if (!this.usdcContract) {
      await this.initialize();
    }
    const allowance = await this.usdcContract.allowance(
      web3Utils.userAddress,
      VAULT_ADDRESS
    );
    return allowance;
  }

  // Approve USDC for vault deposit
  async approveUSDC(amount) {
    if (!this.usdcContract) {
      await this.initialize();
    }

    const parsedAmount = web3Utils.parseUSDC(amount);
    
    console.log('Approving USDC amount:', parsedAmount.toString());
    
    const tx = await this.usdcContract.approve(VAULT_ADDRESS, parsedAmount);
    
    console.log('Approval transaction hash:', tx.hash);
    
    // Wait for confirmation
    const receipt = await web3Utils.waitForTransaction(tx.hash);
    
    if (receipt.status === 1) {
      console.log('Approval successful');
      return {
        success: true,
        txHash: tx.hash,
        etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
      };
    } else {
      throw new Error('Approval transaction failed');
    }
  }

  // Deposit USDC to vault
  async depositUSDC(amount) {
    if (!this.vaultContract) {
      await this.initialize();
    }

    const parsedAmount = web3Utils.parseUSDC(amount);
    
    console.log('Depositing USDC amount:', parsedAmount.toString());
    
    const tx = await this.vaultContract.deposit(parsedAmount);
    
    console.log('Deposit transaction hash:', tx.hash);
    
    // Wait for confirmation
    const receipt = await web3Utils.waitForTransaction(tx.hash);
    
    if (receipt.status === 1) {
      console.log('Deposit successful');
      return {
        success: true,
        txHash: tx.hash,
        etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
      };
    } else {
      throw new Error('Deposit transaction failed');
    }
  }

  // Full deposit flow: approve + deposit
  async fullDepositFlow(amount) {
    try {
      // Step 1: Check current allowance
      const currentAllowance = await this.getUSDCAllowance(amount);
      const parsedAmount = web3Utils.parseUSDC(amount);
      
      // Step 2: Approve if needed
      if (currentAllowance < parsedAmount) {
        console.log('Approving USDC for vault...');
        const approvalResult = await this.approveUSDC(amount);
        
        if (!approvalResult.success) {
          throw new Error('Approval failed');
        }
      }
      
      // Step 3: Deposit
      console.log('Depositing USDC to vault...');
      const depositResult = await this.depositUSDC(amount);
      
      return {
        success: true,
        approvalTxHash: currentAllowance < parsedAmount ? approvalResult.txHash : null,
        depositTxHash: depositResult.txHash,
        etherscanUrl: depositResult.etherscanUrl
      };
      
    } catch (error) {
      console.error('Deposit flow error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
export const vaultService = new VaultService();
