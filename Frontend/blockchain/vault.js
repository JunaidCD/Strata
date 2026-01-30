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
    try {
      const signer = this.vaultContract.runner;
      const userAddress = await signer.getAddress();
      const balance = await this.vaultContract.getUserBalance(userAddress);
      console.log('🔍 Raw vault balance:', balance.toString());
      const formattedBalance = web3Utils.formatUSDC(balance);
      console.log('💰 Formatted vault balance:', formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('Error getting vault balance:', error);
      return "0.00";
    }
  }

  // Check USDC allowance for vault
  async getUSDCAllowance(amount) {
    if (!this.usdcContract) {
      await this.initialize();
    }
    const signer = this.usdcContract.runner;
    const userAddress = await signer.getAddress();
    const allowance = await this.usdcContract.allowance(
      userAddress,
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
    
    console.log('🚀 Depositing USDC amount:', parsedAmount.toString());
    console.log('📍 Vault contract address:', await this.vaultContract.getAddress());
    console.log('👤 User address:', await this.vaultContract.runner.getAddress());
    
    const tx = await this.vaultContract.deposit(parsedAmount);
    
    console.log('📝 Deposit transaction hash:', tx.hash);
    
    // Wait for confirmation
    const receipt = await web3Utils.waitForTransaction(tx.hash);
    
    if (receipt.status === 1) {
      console.log('✅ Deposit successful');
      return {
        success: true,
        txHash: tx.hash,
        etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
      };
    } else {
      throw new Error('Deposit transaction failed');
    }
  }

  // Check if user has any deposits
  async hasDeposits() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    try {
      const signer = this.vaultContract.runner;
      const userAddress = await signer.getAddress();
      const balance = await this.vaultContract.getUserBalance(userAddress);
      console.log('🔍 User deposit check:', balance.toString());
      return balance > 0n;
    } catch (error) {
      console.error('Error checking deposits:', error);
      return false;
    }
  }

  // Withdraw all USDC from vault
  async withdrawUSDC() {
    if (!this.vaultContract) {
      await this.initialize();
    }

    console.log('🔍 Checking balance before withdraw...');
    const signer = this.vaultContract.runner;
    const userAddress = await signer.getAddress();
    const balance = await this.vaultContract.getUserBalance(userAddress);
    console.log('📊 User address:', userAddress);
    console.log('💰 Vault balance (raw):', balance.toString());
    console.log('💰 Vault balance (formatted):', web3Utils.formatUSDC(balance));

    // Check if balance is greater than 0
    if (balance <= 0n) {
      throw new Error('No balance to withdraw in vault contract');
    }

    console.log('Withdrawing all USDC from vault...');
    
    const tx = await this.vaultContract.withdraw();
    
    console.log('Withdraw transaction hash:', tx.hash);
    
    // Wait for confirmation
    const receipt = await web3Utils.waitForTransaction(tx.hash);
    
    if (receipt.status === 1) {
      console.log('Withdraw successful');
      return {
        success: true,
        txHash: tx.hash,
        etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
      };
    } else {
      throw new Error('Withdraw transaction failed');
    }
  }

  // Full deposit flow: approve + deposit
  async fullDepositFlow(amount) {
    try {
      console.log('🚀 Starting deposit flow for amount:', amount);
      
      // Step 1: Check current allowance
      const currentAllowance = await this.getUSDCAllowance(amount);
      const parsedAmount = web3Utils.parseUSDC(amount);
      
      console.log('📊 Current allowance:', currentAllowance.toString());
      console.log('💰 Required amount:', parsedAmount.toString());
      console.log('📍 Vault address:', VAULT_ADDRESS);
      console.log('🪙 USDC address:', USDC_ADDRESS);
      
      let approvalResult = null;
      
      // Step 2: Approve if needed (with buffer for future deposits)
      if (currentAllowance < parsedAmount) {
        console.log('✅ Approval needed - requesting permission...');
        
        // Approve with a buffer (10x the amount) to avoid frequent approvals
        const bufferAmount = parsedAmount * 10n;
        approvalResult = await this.approveUSDCWithAmount(bufferAmount);
        
        if (!approvalResult.success) {
          throw new Error('Approval failed');
        }
        console.log('✅ Approval granted with buffer for future deposits');
      } else {
        console.log('✅ Sufficient allowance already exists - skipping approval');
      }
      
      // Step 3: Deposit
      console.log('📥 Depositing USDC to vault...');
      const depositResult = await this.depositUSDC(amount);
      
      return {
        success: true,
        approvalTxHash: approvalResult ? approvalResult.txHash : null,
        depositTxHash: depositResult.txHash,
        etherscanUrl: depositResult.etherscanUrl,
        skippedApproval: !approvalResult
      };
      
    } catch (error) {
      console.error('❌ Deposit flow error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Approve USDC with specific amount
  async approveUSDCWithAmount(amount) {
    if (!this.usdcContract) {
      await this.initialize();
    }

    console.log('Approving USDC amount:', amount.toString());
    
    const tx = await this.usdcContract.approve(VAULT_ADDRESS, amount);
    
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
}

// Create singleton instance
export const vaultService = new VaultService();
