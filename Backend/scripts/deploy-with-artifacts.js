const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deploy() {
  console.log("Deploying Vault contract to Sepolia...");

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Read compiled contract
  const contractArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/Vault.sol/Vault.json', 'utf8'));
  
  // Your custom USDC address on Sepolia
  const USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
  
  // Create contract factory
  const vaultFactory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    wallet
  );

  // Deploy contract
  console.log("Deploying Vault with USDC address:", USDC_ADDRESS);
  const vault = await vaultFactory.deploy(USDC_ADDRESS);
  
  // Wait for deployment
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  
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
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to deployment-info.json");
  
  // Also save the ABI for frontend
  fs.writeFileSync('vault-abi.json', JSON.stringify(contractArtifact.abi, null, 2));
  console.log("📄 Vault ABI saved to vault-abi.json");
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
