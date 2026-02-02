// Vault service for handling deposit operations with Aave integration
import { ethers } from 'ethers';
import { web3Utils } from './web3.js';
import { USDC_ADDRESS, VAULT_V2_ADDRESS, getUSDCContract, getVaultV2Contract, getAUsdcContract } from './contracts.js';

export class VaultService {
  constructor() {
    this.usdcContract = null;
    this.vaultContract = null;
    this.aUsdcContract = null;
  }

  // Initialize contracts after wallet connection
  async initialize() {
    const { provider, signer } = await web3Utils.initialize();
    
    // Initialize contracts with signer for transactions
    this.usdcContract = getUSDCContract(signer);
    this.vaultContract = getVaultV2Contract(signer);
    this.aUsdcContract = getAUsdcContract(signer);
    
    return {
      usdcContract: this.usdcContract,
      vaultContract: this.vaultContract,
      aUsdcContract: this.aUsdcContract
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

  // Get vault principal balance (user's deposited amount)
  async getVaultBalance() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    try {
      const signer = this.vaultContract.runner;
      const userAddress = await signer.getAddress();
      const balance = await this.vaultContract.getUserBalance(userAddress);
      console.log('🔍 Raw vault principal balance:', balance.toString());
      const formattedBalance = web3Utils.formatUSDC(balance);
      console.log('💰 Formatted vault principal balance:', formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('Error getting vault balance:', error);
      return "0.00";
    }
  }

  // Get user's withdrawable balance (principal + accrued yield)
  async getWithdrawableBalance() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    try {
      const signer = this.vaultContract.runner;
      const userAddress = await signer.getAddress();
      const withdrawableBalance = await this.vaultContract.getUserWithdrawableBalance(userAddress);
      console.log('🔍 Raw withdrawable balance:', withdrawableBalance.toString());
      const formattedBalance = web3Utils.formatUSDC(withdrawableBalance);
      console.log('💰 Formatted withdrawable balance:', formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('Error getting withdrawable balance:', error);
      return "0.00";
    }
  }

  // Get user's accrued yield
  async getUserYield() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    try {
      const signer = this.vaultContract.runner;
      const userAddress = await signer.getAddress();
      const yieldAmount = await this.vaultContract.getUserYield(userAddress);
      console.log('🔍 Raw user yield:', yieldAmount.toString());
      const formattedYield = web3Utils.formatUSDC(yieldAmount);
      console.log('💰 Formatted user yield:', formattedYield);
      return formattedYield;
    } catch (error) {
      console.error('Error getting user yield:', error);
      return "0.00";
    }
  }

  // Get total vault value (all users' principal + yield)
  async getTotalVaultValue() {
    if (!this.vaultContract) {
      await this.initialize();
    }
    try {
      const totalValue = await this.vaultContract.getTotalValue();
      console.log('🔍 Raw total vault value:', totalValue.toString());
      const formattedValue = web3Utils.formatUSDC(totalValue);
      console.log('💰 Formatted total vault value:', formattedValue);
      return formattedValue;
    } catch (error) {
      console.error('Error getting total vault value:', error);
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
      VAULT_V2_ADDRESS
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
    
    const tx = await this.usdcContract.approve(VAULT_V2_ADDRESS, parsedAmount);
    
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

  // Deposit USDC to vault (will be automatically supplied to Aave)
  async depositUSDC(amount) {
    if (!this.vaultContract) {
      await this.initialize();
    }

    const parsedAmount = web3Utils.parseUSDC(amount);
    
    console.log('🚀 Depositing USDC amount:', parsedAmount.toString());
    console.log('📍 Vault v2 contract address:', await this.vaultContract.getAddress());
    console.log('👤 User address:', await this.vaultContract.runner.getAddress());
    
    try {
      const tx = await this.vaultContract.deposit(parsedAmount);
      
      console.log('📝 Deposit transaction hash:', tx.hash);
      
      // Wait for confirmation
      const receipt = await web3Utils.waitForTransaction(tx.hash);
      
      if (receipt.status === 1) {
        console.log('✅ Deposit successful - USDC supplied to Aave');
        return {
          success: true,
          txHash: tx.hash,
          etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
        };
      } else {
        throw new Error('Deposit transaction failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      
      // Handle various MetaMask rejection scenarios
      if (error.code === 4001) {
        throw new Error('Transaction cancelled by user');
      } else if (error.code === -32603) {
        throw new Error('Transaction was rejected');
      } else if (error.message?.includes('rejected') || error.message?.includes('cancelled')) {
        throw new Error('Transaction cancelled by user');
      } else if (error.message?.includes('call revert exception')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('execution reverted')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction cancelled by user');
      }
      
      // If it's a different error, re-throw it
      throw error;
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

  // Withdraw all USDC from vault (will withdraw from Aave and return principal + yield)
  async withdrawUSDC() {
    if (!this.vaultContract) {
      await this.initialize();
    }

    console.log('🔍 Checking balance before withdraw...');
    const signer = this.vaultContract.runner;
    const userAddress = await signer.getAddress();
    const principal = await this.vaultContract.getUserBalance(userAddress);
    const withdrawable = await this.vaultContract.getUserWithdrawableBalance(userAddress);
    
    console.log('📊 User address:', userAddress);
    console.log('💰 Principal (raw):', principal.toString());
    console.log('💰 Withdrawable (raw):', withdrawable.toString());
    console.log('💰 Principal (formatted):', web3Utils.formatUSDC(principal));
    console.log('💰 Withdrawable (formatted):', web3Utils.formatUSDC(withdrawable));

    // Check if balance is greater than 0
    if (principal <= 0n) {
      throw new Error('No balance to withdraw in vault contract');
    }

    console.log('Withdrawing all USDC from vault (principal + yield from Aave)...');
    
    try {
      const tx = await this.vaultContract.withdraw();
      
      console.log('Withdraw transaction hash:', tx.hash);
      
      // Wait for confirmation
      const receipt = await web3Utils.waitForTransaction(tx.hash);
      
      if (receipt.status === 1) {
        console.log('✅ Withdraw successful - received USDC + yield from Aave');
        return {
          success: true,
          txHash: tx.hash,
          etherscanUrl: web3Utils.getEtherscanUrl(tx.hash)
        };
      } else {
        throw new Error('Withdraw transaction failed');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      
      // Handle various MetaMask rejection scenarios
      if (error.code === 4001) {
        throw new Error('Transaction cancelled by user');
      } else if (error.code === -32603) {
        throw new Error('Transaction was rejected');
      } else if (error.message?.includes('rejected') || error.message?.includes('cancelled')) {
        throw new Error('Transaction cancelled by user');
      } else if (error.message?.includes('call revert exception')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('execution reverted')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction cancelled by user');
      }
      
      // If it's a different error, re-throw it
      throw error;
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
      console.log('📍 Vault v2 address:', VAULT_V2_ADDRESS);
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
      console.log('📥 Depositing USDC to vault (will supply to Aave)...');
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
    
    try {
      const tx = await this.usdcContract.approve(VAULT_V2_ADDRESS, amount);
      
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
    } catch (error) {
      console.error('Approval error:', error);
      
      // Handle various MetaMask rejection scenarios
      if (error.code === 4001) {
        throw new Error('Transaction cancelled by user');
      } else if (error.code === -32603) {
        throw new Error('Transaction was rejected');
      } else if (error.message?.includes('rejected') || error.message?.includes('cancelled')) {
        throw new Error('Transaction cancelled by user');
      } else if (error.message?.includes('call revert exception')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('execution reverted')) {
        throw new Error('Transaction was cancelled or failed');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction cancelled by user');
      }
      
      // If it's a different error, re-throw it
      throw error;
    }
  }
}

// Create singleton instance
export const vaultService = new VaultService();
