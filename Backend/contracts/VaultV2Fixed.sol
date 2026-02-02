// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Vault V2 Fixed
 * @dev Simple vault with display-only yield for testing
 */
contract VaultV2Fixed is ReentrancyGuard {
    IERC20 public usdcToken;
    
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public depositTimestamps;
    
    uint256 public totalDeposits;
    
    // Display APY for testing: 100% annual
    uint256 public constant DISPLAY_APY = 10000; // 100% in basis points
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Mock USDC transfer failed");
        
        userBalances[msg.sender] += amount;
        depositTimestamps[msg.sender] = block.timestamp;
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount);
    }
    
    function withdraw() external nonReentrant {
        uint256 principal = userBalances[msg.sender];
        require(principal > 0, "No balance to withdraw");
        
        // Reset user state
        userBalances[msg.sender] = 0;
        depositTimestamps[msg.sender] = 0;
        totalDeposits -= principal;
        
        // Transfer only the principal (we have enough tokens for this)
        bool success = usdcToken.transfer(msg.sender, principal);
        require(success, "Mock USDC transfer failed");
        
        emit Withdrawn(msg.sender, principal);
    }
    
    function calculateDisplayYield(address user) public view returns (uint256) {
        uint256 principal = userBalances[user];
        if (principal == 0) return 0;
        
        uint256 depositTime = depositTimestamps[user];
        if (depositTime == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - depositTime;
        uint256 secondsInYear = 365 * 24 * 60 * 60;
        
        return (principal * DISPLAY_APY * timeElapsed) / (secondsInYear * 10000);
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    function getUserWithdrawableBalance(address user) external view returns (uint256) {
        uint256 principal = userBalances[user];
        if (principal == 0) return 0;
        
        // Show principal + display yield for UI purposes
        return principal + calculateDisplayYield(user);
    }
    
    function getUserYield(address user) external view returns (uint256) {
        return calculateDisplayYield(user);
    }
    
    function getTotalValue() external view returns (uint256) {
        return totalDeposits;
    }
    
    function getTotalDeposited() external view returns (uint256) {
        return totalDeposits;
    }
    
    // Mock Aave functions for frontend compatibility
    function aavePool() external pure returns (address) {
        return 0x6ae43d5257286e850d7572924237F96bdc3d9Ea6;
    }
    
    function aUsdcToken() external view returns (address) {
        return address(usdcToken);
    }
}
