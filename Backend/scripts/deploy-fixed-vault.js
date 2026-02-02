import { ethers } from "ethers";
import { readFileSync } from "fs";

async function main() {
  console.log("🚀 Deploying Fixed Vault (Working Withdraw)");
  console.log("==========================================");
  
  // Get provider and signer
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/IIlDUJE7IyZMGuPA5wDTPDAv_2FrgPhf");
  const privateKey = "0xba082e7da753abf216f1169f7102dc1fdf85861e73f1b15100de3e397bed6f9f";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Your Mock USDC address
  const MOCK_USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
  
  // Read contract artifacts
  const vaultV2Artifact = JSON.parse(readFileSync("./artifacts/contracts/VaultV2Fixed.sol/VaultV2Fixed.json", "utf8"));
  
  // Deploy Fixed Vault
  console.log("\n🏦 Deploying Fixed Vault...");
  const VaultV2Fixed = new ethers.ContractFactory(vaultV2Artifact.abi, vaultV2Artifact.bytecode, wallet);
  const vaultV2 = await VaultV2Fixed.deploy(MOCK_USDC_ADDRESS);
  await vaultV2.waitForDeployment();
  const vaultV2Address = await vaultV2.getAddress();
  console.log("✅ Fixed Vault deployed to:", vaultV2Address);
  
  console.log("\n🎉 Fixed Vault Deployed!");
  console.log("========================");
  
  console.log("\n📋 Update Your Frontend:");
  console.log("========================");
  console.log("USDC_ADDRESS =", MOCK_USDC_ADDRESS);
  console.log("VAULT_V2_ADDRESS =", vaultV2Address);
  
  console.log("\n✨ Features:");
  console.log("============");
  console.log("✅ Your Mock USDC token");
  console.log("✅ Display yield (100% APY for testing)");
  console.log("✅ Working withdraw (principal only)");
  console.log("✅ No token balance issues");
  console.log("✅ Complete deposit/withdraw flow");
  
  return {
    mockUSDCAddress: MOCK_USDC_ADDRESS,
    vaultV2Address,
    deployerAddress: wallet.address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
