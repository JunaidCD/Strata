const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying Vault contract to Sepolia...");

  // Mock USDC address on Sepolia (replace with your actual deployed USDC address)
  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  
  // Get contract factory
  const Vault = await ethers.getContractFactory("Vault");
  
  // Deploy contract with USDC address
  const vault = await Vault.deploy(USDC_ADDRESS);
  
  // Wait for deployment to complete
  await vault.deployed();
  
  const vaultAddress = vault.address;
  
  console.log("✅ Vault deployed successfully!");
  console.log("📍 Vault Address:", vaultAddress);
  console.log("🪙 USDC Address:", USDC_ADDRESS);
  console.log("🔗 Sepolia Etherscan: https://sepolia.etherscan.io/address/" + vaultAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    vaultAddress: vaultAddress,
    usdcAddress: USDC_ADDRESS,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📄 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
