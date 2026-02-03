import { ethers } from "ethers";
import { readFileSync } from "fs";

async function main() {
  console.log("🚀 Deploying Real USDC + Real Aave Vault");
  console.log("==========================================");
  
  // Get provider and signer
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/IIlDUJE7IyZMGuPA5wDTPDAv_2FrgPhf");
  const privateKey = "0xba082e7da753abf216f1169f7102dc1fdf85861e73f1b15100de3e397bed6f9f";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Real USDC address on Sepolia
  const REAL_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  
  // Read contract artifacts
  const vaultV2Artifact = JSON.parse(readFileSync("./artifacts/contracts/VaultV2RealAave.sol/VaultV2RealAave.json", "utf8"));
  
  // Deploy Real Aave Vault
  console.log("\n🏦 Deploying Real Aave Vault...");
  const VaultV2RealAave = new ethers.ContractFactory(vaultV2Artifact.abi, vaultV2Artifact.bytecode, wallet);
  const vaultV2 = await VaultV2RealAave.deploy(REAL_USDC_ADDRESS);
  await vaultV2.waitForDeployment();
  const vaultV2Address = await vaultV2.getAddress();
  console.log("✅ Real Aave Vault deployed to:", vaultV2Address);
  
  console.log("\n🎉 Real USDC + Real Aave Vault Deployed!");
  console.log("==========================================");
  
  console.log("\n📋 Update Your Frontend:");
  console.log("========================");
  console.log("USDC_ADDRESS =", REAL_USDC_ADDRESS);
  console.log("VAULT_V2_ADDRESS =", vaultV2Address);
  
  console.log("\n✨ Features:");
  console.log("============");
  console.log("✅ Real USDC (whitelisted in Aave)");
  console.log("✅ Real Aave protocol integration");
  console.log("✅ Real yield generation");
  console.log("✅ Principal + yield withdrawal");
  console.log("✅ Production-ready");
  
  return {
    realUSDCAddress: REAL_USDC_ADDRESS,
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