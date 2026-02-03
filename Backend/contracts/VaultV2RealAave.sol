// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Aave Pool interface
interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

/**
 * @title Vault V2 with Real USDC and Real Aave
 * @dev Uses real USDC on Sepolia with real Aave protocol
 */
contract VaultV2RealAave is ReentrancyGuard {
    IERC20 public usdcToken;           // Real USDC on Sepolia
    IPool public aavePool;            // Real Aave Pool
    IERC20 public aUsdcToken;          // aUSDC (interest-bearing USDC)
    
    mapping(address => uint256) public userBalances;
    uint256 public totalDeposits;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        // Correct Sepolia Aave V3 Pool address from official Aave Address Book
        aavePool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
        
        // aUSDC address on Sepolia
        aUsdcToken = IERC20(0x5414bd0882B4646B5A778350B1C84AB69E627735);
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Check user balance first
        uint256 userBalance = usdcToken.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient USDC balance");
        
        // Check allowance
        uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");
        
        // Transfer USDC from user
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");
        
        // Check vault balance after transfer
        uint256 vaultBalance = usdcToken.balanceOf(address(this));
        require(vaultBalance >= amount, "Vault did not receive USDC");
        
        // Approve Aave Pool to spend USDC
        usdcToken.approve(address(aavePool), amount);
        
        // Supply USDC to Aave
        try aavePool.supply(address(usdcToken), amount, address(this), 0) {
            // Success - update user balance
            userBalances[msg.sender] += amount;
            totalDeposits += amount;
            emit Deposited(msg.sender, amount);
        } catch Error(string memory reason) {
            // If Aave supply fails, return USDC to user
            usdcToken.transfer(msg.sender, amount);
            revert(string(abi.encodePacked("Aave supply failed: ", reason)));
        } catch {
            // If Aave supply fails with unknown error, return USDC to user
            usdcToken.transfer(msg.sender, amount);
            revert("Aave supply failed: unknown error");
        }
    }
    
    function withdraw() external nonReentrant {
        uint256 principal = userBalances[msg.sender];
        require(principal > 0, "No balance to withdraw");
        
        // Calculate user's proportional share of aUSDC
        uint256 totalAUsdcBalance = aUsdcToken.balanceOf(address(this));
        require(totalAUsdcBalance > 0, "No aUSDC balance in vault");
        
        uint256 userAUsdcShare = (principal * totalAUsdcBalance) / totalDeposits;
        require(userAUsdcShare > 0, "User has no aUSDC share");
        
        // Reset user balance
        userBalances[msg.sender] = 0;
        totalDeposits -= principal;
        
        // Withdraw USDC + yield from Aave
        try aavePool.withdraw(address(usdcToken), userAUsdcShare, address(this)) returns (uint256 usdcReceived) {
            require(usdcReceived > 0, "No USDC received from Aave");
            
            // Transfer to user
            bool success = usdcToken.transfer(msg.sender, usdcReceived);
            require(success, "USDC transfer failed");
            
            emit Withdrawn(msg.sender, usdcReceived);
        } catch Error(string memory reason) {
            // If Aave withdraw fails, restore user balance
            userBalances[msg.sender] = principal;
            totalDeposits += principal;
            revert(string(abi.encodePacked("Aave withdraw failed: ", reason)));
        } catch {
            // If Aave withdraw fails with unknown error, restore user balance
            userBalances[msg.sender] = principal;
            totalDeposits += principal;
            revert("Aave withdraw failed: unknown error");
        }
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    function getUserWithdrawableBalance(address user) external view returns (uint256) {
        uint256 principal = userBalances[user];
        if (principal == 0) return 0;
        
        // Calculate proportional share of aUSDC
        uint256 totalAUsdcBalance = aUsdcToken.balanceOf(address(this));
        uint256 userAUsdcShare = (principal * totalAUsdcBalance) / totalDeposits;
        
        return userAUsdcShare; // This represents principal + yield
    }
    
    function getUserYield(address user) external view returns (uint256) {
        uint256 principal = userBalances[user];
        if (principal == 0) return 0;
        
        // Calculate proportional share of aUSDC inline
        uint256 totalAUsdcBalance = aUsdcToken.balanceOf(address(this));
        uint256 userAUsdcShare = (principal * totalAUsdcBalance) / totalDeposits;
        
        if (userAUsdcShare > principal) {
            return userAUsdcShare - principal;
        }
        return 0;
    }
    
    function getTotalValue() external view returns (uint256) {
        return aUsdcToken.balanceOf(address(this));
    }
    
    function getTotalDeposited() external view returns (uint256) {
        return totalDeposits;
    }
    
    function getAavePool() external view returns (address) {
        return address(aavePool);
    }
    
    function getAUsdcToken() external view returns (address) {
        return address(aUsdcToken);
    }
}