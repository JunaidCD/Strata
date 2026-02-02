import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying Vault v2 with Aave integration...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Contract addresses on Sepolia
  const USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
  const AAVE_POOL_ADDRESS = "0x6Ae43d5257286e850D7572924237F96BdC3d9eA6";
  
  // Deploy Vault v2
  const VaultV2 = await ethers.getContractFactory("VaultV2");
  const vaultV2 = await VaultV2.deploy(USDC_ADDRESS, AAVE_POOL_ADDRESS);
  
  await vaultV2.waitForDeployment();
  const vaultV2Address = await vaultV2.getAddress();
  
  console.log("Vault v2 deployed to:", vaultV2Address);
  console.log("USDC Token:", USDC_ADDRESS);
  console.log("Aave Pool:", AAVE_POOL_ADDRESS);
  
  // Verify deployment
  console.log("\nVerifying deployment...");
  
  const usdcToken = await vaultV2.usdcToken();
  const aavePool = await vaultV2.aavePool();
  const aUsdcToken = await vaultV2.aUsdcToken();
  
  console.log("✅ USDC Token in contract:", usdcToken);
  console.log("✅ Aave Pool in contract:", aavePool);
  console.log("✅ aUSDC Token in contract:", aUsdcToken);
  
  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    vaultV2Address: vaultV2Address,
    usdcAddress: USDC_ADDRESS,
    aavePoolAddress: AAVE_POOL_ADDRESS,
    aUsdcAddress: aUsdcToken,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };
  
  fs.writeFileSync(
    "./deployment-info-v2.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to deployment-info-v2.json");
  console.log("\n🎉 Vault v2 deployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Update frontend to use VAULT_V2_ADDRESS");
  console.log("2. Test deposit and withdraw functionality");
  console.log("3. Verify yield accrual over time");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
