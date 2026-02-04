// Blockchain configuration and utilities
import { ethers } from 'ethers';

export const SEPOLIA_NETWORK_ID = 11155111;
export const USDC_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"; // Real DAI on Sepolia (supported in Aave)
export const VAULT_V2_ADDRESS = "0xD90Fe2EF9c2e356257b632893bf9cae6275a4a3c"; // Real Aave Vault (DAI version)

// Aave Protocol Addresses (Sepolia)
export const AAVE_POOL_ADDRESS = "0x6Ae43d5257286e850D7572924237F96BdC3d9eA6"; // Aave Pool on Sepolia
export const AUSDC_ADDRESS = "0x00000000000000000299E1616d458215Bb2f7CC8"; // aDAI (interest-bearing DAI) on Sepolia

// DAI ABI (ERC20 standard)
export const USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

// Vault v2 ABI (with Aave integration)
export const VAULT_V2_ABI = [
  "function daiToken() view returns (address)",
  "function aDaiToken() view returns (address)",
  "function aavePool() view returns (address)",
  "function userBalances(address) view returns (uint256)",
  "function deposit(uint256 amount)",
  "function withdraw()",
  "function getUserBalance(address user) view returns (uint256)",
  "function getTotalDeposited() view returns (uint256)",
  "function getTotalValue() view returns (uint256)",
  "function getUserWithdrawableBalance(address user) view returns (uint256)",
  "function getUserYield(address user) view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)"
];

// Aave Pool ABI (minimal for supply and withdraw)
export const AAVE_POOL_ABI = [
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];

// aUSDC ABI (interest-bearing USDC)
export const AUSDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Contract instances
export const getUSDCContract = (provider, address = USDC_ADDRESS) => {
  return new ethers.Contract(address, USDC_ABI, provider);
};

export const getVaultV2Contract = (provider, address = VAULT_V2_ADDRESS) => {
  return new ethers.Contract(address, VAULT_V2_ABI, provider);
};

export const getAavePoolContract = (provider, address = AAVE_POOL_ADDRESS) => {
  return new ethers.Contract(address, AAVE_POOL_ABI, provider);
};

export const getAUsdcContract = (provider, address = AUSDC_ADDRESS) => {
  return new ethers.Contract(address, AUSDC_ABI, provider);
};

// Legacy support (for backward compatibility)
export const VAULT_ADDRESS = VAULT_V2_ADDRESS;
export const VAULT_ABI = VAULT_V2_ABI;
export const getVaultContract = getVaultV2Contract;
