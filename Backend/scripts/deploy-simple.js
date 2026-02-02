import hre from "hardhat";

async function main() {
  console.log("Deploying Vault v2 with Aave integration...");
  
  // Get the deployer account
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deploying contracts with the account:", deployer.account.address);
  
  // Contract addresses on Sepolia
  const USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
  const AAVE_POOL_ADDRESS = "0x6Ae43d5257286e850D7572924237F96BdC3d9eA6";
  
  // Deploy Vault v2 using viem
  const publicClient = await hre.viem.getPublicClient();
  const vaultContract = await hre.viem.deployContract("VaultV2", [USDC_ADDRESS, AAVE_POOL_ADDRESS]);
  
  console.log("✅ Vault v2 deployed to:", vaultContract.address);
  console.log("✅ USDC Token:", USDC_ADDRESS);
  console.log("✅ Aave Pool:", AAVE_POOL_ADDRESS);
  
  // Verify deployment
  console.log("\nVerifying deployment...");
  
  const usdcToken = await vaultContract.read.usdcToken();
  const aavePool = await vaultContract.read.aavePool();
  const aUsdcToken = await vaultContract.read.aUsdcToken();
  
  console.log("✅ USDC Token in contract:", usdcToken);
  console.log("✅ Aave Pool in contract:", aavePool);
  console.log("✅ aUSDC Token in contract:", aUsdcToken);
  
  console.log("\n🎉 Vault v2 deployment completed successfully!");
  console.log("\n📋 Contract Address:", vaultContract.address);
  console.log("📋 Update your frontend contracts.js with this address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
