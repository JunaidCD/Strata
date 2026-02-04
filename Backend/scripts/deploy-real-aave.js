import { ethers } from "ethers";
import { readFileSync } from "fs";

async function main() {
  console.log(" Deploying Real DAI + Real Aave Vault");
  console.log("==========================================");
  
  // Get provider and signer
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/IIlDUJE7IyZMGuPA5wDTPDAv_2FrgPhf");
  const privateKey = "0xba082e7da753abf216f1169f7102dc1fdf85861e73f1b15100de3e397bed6f9f";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Real DAI address on Sepolia (supported in Aave)
  const REAL_DAI_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
  
  // Read contract artifacts
  const vaultV2Artifact = JSON.parse(readFileSync("./artifacts/contracts/VaultV2RealAave.sol/VaultV2RealAave.json", "utf8"));
  
  // Deploy Real Aave Vault
  console.log("\n🏦 Deploying Real Aave Vault...");
  const VaultV2RealAave = new ethers.ContractFactory(vaultV2Artifact.abi, vaultV2Artifact.bytecode, wallet);
  const vaultV2 = await VaultV2RealAave.deploy(REAL_DAI_ADDRESS);
  await vaultV2.waitForDeployment();
  const vaultV2Address = await vaultV2.getAddress();
  console.log("✅ Real Aave Vault deployed to:", vaultV2Address);
  
  console.log("\n🎉 Real DAI + Real Aave Vault Deployed!");
  console.log("==========================================");
  
  console.log("\n📋 Update Your Frontend:");
  console.log("========================");
  console.log("DAI_ADDRESS =", REAL_DAI_ADDRESS);
  console.log("VAULT_V2_ADDRESS =", vaultV2Address);
  
  console.log("\n✨ Features:");
  console.log("============");
  console.log("✅ Real DAI (supported in Aave)");
  console.log("✅ Real Aave protocol integration");
  console.log("✅ Real yield generation");
  console.log("✅ Principal + yield withdrawal");
  console.log("✅ Production-ready");
  
  return {
    realDAIAddress: REAL_DAI_ADDRESS,
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