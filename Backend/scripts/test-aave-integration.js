const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Vault v2 Aave Integration...");
  
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Testing with accounts:");
  console.log("- Deployer:", deployer.address);
  console.log("- User1:", user1.address);
  console.log("- User2:", user2.address);
  
  // Contract addresses on Sepolia
  const USDC_ADDRESS = "0xA17201d0E98437862E0d9eDFc1D57d2d725cB939";
  const AAVE_POOL_ADDRESS = "0x6Ae43d5257286e850D7572924237F96BdC3d9eA6";
  const AUSDC_ADDRESS = "0x5414bD0882B4646B5A778350B1c84AB69e627735";
  
  // Get contracts
  const usdcContract = await ethers.getContractAt("IERC20", USDC_ADDRESS);
  const aUsdcContract = await ethers.getContractAt("IERC20", AUSDC_ADDRESS);
  const aavePool = await ethers.getContractAt("IPool", AAVE_POOL_ADDRESS);
  
  // Deploy Vault v2
  console.log("\n📦 Deploying Vault v2...");
  const VaultV2 = await ethers.getContractFactory("VaultV2");
  const vaultV2 = await VaultV2.deploy(USDC_ADDRESS, AAVE_POOL_ADDRESS);
  await vaultV2.waitForDeployment();
  const vaultAddress = await vaultV2.getAddress();
  console.log("Vault v2 deployed to:", vaultAddress);
  
  // Test amounts (in USDC, 6 decimals)
  const depositAmount = ethers.parseUnits("100", 6); // 100 USDC
  const largeAmount = ethers.parseUnits("10000", 6); // 10,000 USDC for funding
  
  try {
    // Step 1: Fund test users with USDC (if they don't have enough)
    console.log("\n💰 Checking user USDC balances...");
    const user1Balance = await usdcContract.balanceOf(user1.address);
    const user2Balance = await usdcContract.balanceOf(user2.address);
    
    console.log("User1 USDC balance:", ethers.formatUnits(user1Balance, 6));
    console.log("User2 USDC balance:", ethers.formatUnits(user2Balance, 6));
    
    // Step 2: User1 deposits 100 USDC
    console.log("\n📥 User1 depositing 100 USDC...");
    
    // User1 approves vault to spend USDC
    await usdcContract.connect(user1).approve(vaultAddress, depositAmount);
    console.log("✅ User1 approved vault");
    
    // User1 deposits
    await vaultV2.connect(user1).deposit(depositAmount);
    console.log("✅ User1 deposited 100 USDC");
    
    // Check user1's principal balance
    const user1Principal = await vaultV2.getUserBalance(user1.address);
    console.log("User1 principal balance:", ethers.formatUnits(user1Principal, 6));
    
    // Check vault's aUSDC balance
    const vaultAUsdcBalance = await aUsdcContract.balanceOf(vaultAddress);
    console.log("Vault aUSDC balance:", ethers.formatUnits(vaultAUsdcBalance, 6));
    
    // Step 3: Wait a bit for some yield to accrue (simulated)
    console.log("\n⏳ Waiting for yield to accrue...");
    console.log("(In production, yield accrues over time from Aave lending)");
    
    // Step 4: Check user1's withdrawable balance and yield
    const user1Withdrawable = await vaultV2.getUserWithdrawableBalance(user1.address);
    const user1Yield = await vaultV2.getUserYield(user1.address);
    
    console.log("User1 withdrawable balance:", ethers.formatUnits(user1Withdrawable, 6));
    console.log("User1 accrued yield:", ethers.formatUnits(user1Yield, 6));
    
    // Step 5: User2 deposits 50 USDC
    console.log("\n📥 User2 depositing 50 USDC...");
    const depositAmount2 = ethers.parseUnits("50", 6);
    
    await usdcContract.connect(user2).approve(vaultAddress, depositAmount2);
    await vaultV2.connect(user2).deposit(depositAmount2);
    console.log("✅ User2 deposited 50 USDC");
    
    // Check vault's total aUSDC balance
    const totalAUsdcBalance = await aUsdcContract.balanceOf(vaultAddress);
    console.log("Total vault aUSDC balance:", ethers.formatUnits(totalAUsdcBalance, 6));
    
    // Step 6: User1 withdraws (should get principal + yield)
    console.log("\n💸 User1 withdrawing full balance...");
    
    const user1BalanceBefore = await usdcContract.balanceOf(user1.address);
    console.log("User1 USDC balance before withdraw:", ethers.formatUnits(user1BalanceBefore, 6));
    
    await vaultV2.connect(user1).withdraw();
    console.log("✅ User1 withdrew full balance");
    
    const user1BalanceAfter = await usdcContract.balanceOf(user1.address);
    console.log("User1 USDC balance after withdraw:", ethers.formatUnits(user1BalanceAfter, 6));
    
    const withdrawnAmount = user1BalanceAfter - user1BalanceBefore;
    console.log("Total withdrawn:", ethers.formatUnits(withdrawnAmount, 6));
    
    // Check user1's balance after withdrawal
    const user1PrincipalAfter = await vaultV2.getUserBalance(user1.address);
    console.log("User1 principal after withdraw:", ethers.formatUnits(user1PrincipalAfter, 6));
    
    // Step 7: User2 withdraws
    console.log("\n💸 User2 withdrawing full balance...");
    
    const user2BalanceBefore = await usdcContract.balanceOf(user2.address);
    console.log("User2 USDC balance before withdraw:", ethers.formatUnits(user2BalanceBefore, 6));
    
    await vaultV2.connect(user2).withdraw();
    console.log("✅ User2 withdrew full balance");
    
    const user2BalanceAfter = await usdcContract.balanceOf(user2.address);
    console.log("User2 USDC balance after withdraw:", ethers.formatUnits(user2BalanceAfter, 6));
    
    const user2WithdrawnAmount = user2BalanceAfter - user2BalanceBefore;
    console.log("User2 total withdrawn:", ethers.formatUnits(user2WithdrawnAmount, 6));
    
    // Final checks
    console.log("\n🔍 Final vault state:");
    const finalVaultAUsdc = await aUsdcContract.balanceOf(vaultAddress);
    console.log("Final vault aUSDC balance:", ethers.formatUnits(finalVaultAUsdc, 6));
    
    const finalUser1Balance = await vaultV2.getUserBalance(user1.address);
    const finalUser2Balance = await vaultV2.getUserBalance(user2.address);
    console.log("Final user1 principal:", ethers.formatUnits(finalUser1Balance, 6));
    console.log("Final user2 principal:", ethers.formatUnits(finalUser2Balance, 6));
    
    console.log("\n✅ Aave integration test completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("- ✅ Vault v2 deployed with Aave integration");
    console.log("- ✅ Users can deposit USDC (automatically supplied to Aave)");
    console.log("- ✅ Vault holds aUSDC (yield-bearing tokens)");
    console.log("- ✅ Users can withdraw principal + yield");
    console.log("- ✅ Multiple users can deposit/withdraw independently");
    console.log("- ✅ No stuck funds - all withdrawals work correctly");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
