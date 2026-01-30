// Blockchain configuration and utilities
import { ethers } from 'ethers';

export const SEPOLIA_NETWORK_ID = 11155111;
export const USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
export const VAULT_ADDRESS = "0xBeBc535673363b43390D45896090B49AFE6D9F77"; // Updated with withdraw functionality

// USDC ABI (minimal for what we need)
export const USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

// Vault ABI
export const VAULT_ABI = [
  "function usdcToken() view returns (address)",
  "function userBalances(address) view returns (uint256)",
  "function deposit(uint256 amount)",
  "function withdraw()",
  "function getUserBalance(address user) view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)"
];

// Contract instances
export const getUSDCContract = (provider, address = USDC_ADDRESS) => {
  return new ethers.Contract(address, USDC_ABI, provider);
};

export const getVaultContract = (provider, address = VAULT_ADDRESS) => {
  return new ethers.Contract(address, VAULT_ABI, provider);
};
