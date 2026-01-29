// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Vault v1
 * @dev Minimal vault contract for USDC deposits and withdrawals
 * Only accepts USDC, tracks user balances, allows full withdrawals
 * No fees, no yield, no admin logic
 */
contract Vault {
    IERC20 public usdcToken;
    
    // Mapping to track deposited balance per user
    mapping(address => uint256) public userBalances;
    
    // Events for tracking deposits and withdrawals
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    /**
     * @dev Constructor takes USDC token address
     * @param _usdcToken Address of the USDC ERC20 token
     */
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Deposit USDC into vault
     * User must approve vault to spend their USDC first
     * @param amount Amount of USDC to deposit (in wei, 6 decimals for USDC)
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Pull USDC from user to vault using transferFrom
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");
        
        // Update user balance
        userBalances[msg.sender] += amount;
        
        emit Deposited(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw all deposited USDC
     * Only allows full withdrawal of user's entire balance
     */
    function withdraw() external {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        // Reset user balance to prevent reentrancy
        userBalances[msg.sender] = 0;
        
        // Transfer USDC to user
        bool success = usdcToken.transfer(msg.sender, balance);
        require(success, "USDC transfer failed");
        
        emit Withdrawn(msg.sender, balance);
    }
    
    /**
     * @dev Get user's current deposited balance
     * @param user Address of the user
     * @return User's deposited USDC balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
}
