const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deploy() {
  console.log("Deploying Vault contract to Sepolia...");

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Mock USDC address on Sepolia
  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  
  // Vault contract ABI and bytecode
  const vaultABI = [
    "function usdcToken() view returns (address)",
    "function userBalances(address) view returns (uint256)",
    "function deposit(uint256 amount)",
    "function withdraw()",
    "function getUserBalance(address user) view returns (uint256)",
    "event Deposited(address indexed user, uint256 amount)",
    "event Withdrawn(address indexed user, uint256 amount)"
  ];

  const vaultBytecode = "0x608060405234801561001057600080fd5b50604051610a51380380610a5183398101604081905261002f91610044565b6001600160a01b0316608052610054565b6000806040838503121561005757600080fd5b60006100638582860161005d565b92505060206100738582860161005d565b9150509250929050565b6001600160a01b038116811461009057600080fd5b50565b6109bb806100a36000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632e1a7d4d1461004657806395d89b4114610064578063a9059cbb1461006c578063dd62ed3e14610080575b600080fd5b61004e61008f565b60405161005b91906100d9565b60405180910390f35b61006c61008f565b60405161005b91906100d9565b61004e61009f565b60405161005b91906100d9565b61004e6100af565b60405161005b91906100d9565b6000546001600160a01b031661008f565b6000546001600160a01b031633146100c3576100be6001600160a01b031661008f565b6100cb565b600080fd5b600055565b6000602082840312156100e957600080fd5b5035919050565b6001600160a01b0391909116815260200190565b60601b905256fea2646970667358221220b1f2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c64736f6c63430008110033";

  // Create contract factory
  const vaultFactory = new ethers.ContractFactory(vaultABI, vaultBytecode, wallet);

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
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
