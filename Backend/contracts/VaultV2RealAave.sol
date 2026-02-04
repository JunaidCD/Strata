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
 * @title Vault V2 with Real DAI and Real Aave
 * @dev Uses real DAI on Sepolia with real Aave protocol (USDC not supported in Aave Sepolia)
 */
contract VaultV2RealAave is ReentrancyGuard {
    IERC20 public daiToken;            // Real DAI on Sepolia (supported in Aave)
    IPool public aavePool;            // Real Aave Pool
    IERC20 public aDaiToken;          // aDAI (interest-bearing DAI)
    
    mapping(address => uint256) public userBalances;
    uint256 public totalDeposits;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(address _daiToken) {
        daiToken = IERC20(_daiToken);
        // Correct Sepolia Aave V3 Pool address from official Aave Address Book
        aavePool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
        
        // aDAI address on Sepolia
        aDaiToken = IERC20(0x00000000000000000299E1616d458215Bb2f7CC8);
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Check user balance first
        uint256 userBalance = daiToken.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient DAI balance");
        
        // Check allowance
        uint256 allowance = daiToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");
        
        // Transfer DAI from user
        bool success = daiToken.transferFrom(msg.sender, address(this), amount);
        require(success, "DAI transfer failed");
        
        // Check vault balance after transfer
        uint256 vaultBalance = daiToken.balanceOf(address(this));
        require(vaultBalance >= amount, "Vault did not receive DAI");
        
        // Approve Aave Pool to spend DAI
        daiToken.approve(address(aavePool), amount);
        
        // Supply DAI to Aave
        try aavePool.supply(address(daiToken), amount, address(this), 0) {
            // Success - update user balance
            userBalances[msg.sender] += amount;
            totalDeposits += amount;
            emit Deposited(msg.sender, amount);
        } catch Error(string memory reason) {
            // If Aave supply fails, return DAI to user
            daiToken.transfer(msg.sender, amount);
            revert(string(abi.encodePacked("Aave supply failed: ", reason)));
        } catch {
            // If Aave supply fails with unknown error, return DAI to user
            daiToken.transfer(msg.sender, amount);
            revert("Aave supply failed: unknown error");
        }
    }
    
    function withdraw() external nonReentrant {
        uint256 principal = userBalances[msg.sender];
        require(principal > 0, "No balance to withdraw");
        
        // Calculate user's proportional share of aDAI
        uint256 totalADaiBalance = aDaiToken.balanceOf(address(this));
        require(totalADaiBalance > 0, "No aDAI balance in vault");
        
        uint256 userADaiShare = (principal * totalADaiBalance) / totalDeposits;
        require(userADaiShare > 0, "User has no aDAI share");
        
        // Reset user balance
        userBalances[msg.sender] = 0;
        totalDeposits -= principal;
        
        // Withdraw DAI + yield from Aave
        try aavePool.withdraw(address(daiToken), userADaiShare, address(this)) returns (uint256 daiReceived) {
            require(daiReceived > 0, "No DAI received from Aave");
            
            // Transfer to user
            bool success = daiToken.transfer(msg.sender, daiReceived);
            require(success, "DAI transfer failed");
            
            emit Withdrawn(msg.sender, daiReceived);
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
        
        // Calculate proportional share of aDAI
        uint256 totalADaiBalance = aDaiToken.balanceOf(address(this));
        uint256 userADaiShare = (principal * totalADaiBalance) / totalDeposits;
        
        return userADaiShare; // This represents principal + yield
    }
    
    function getUserYield(address user) external view returns (uint256) {
        uint256 principal = userBalances[user];
        if (principal == 0) return 0;
        
        // Calculate proportional share of aDAI inline
        uint256 totalADaiBalance = aDaiToken.balanceOf(address(this));
        uint256 userADaiShare = (principal * totalADaiBalance) / totalDeposits;
        
        if (userADaiShare > principal) {
            return userADaiShare - principal;
        }
        return 0;
    }
    
    function getTotalValue() external view returns (uint256) {
        return aDaiToken.balanceOf(address(this));
    }
    
    function getTotalDeposited() external view returns (uint256) {
        return totalDeposits;
    }
    
    function getAavePool() external view returns (address) {
        return address(aavePool);
    }
    
    function getADaiToken() external view returns (address) {
        return address(aDaiToken);
    }
}