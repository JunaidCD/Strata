import { useState, createContext, useContext, useEffect, useRef } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { Layers } from "lucide-react";
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { vaultService } from '../blockchain/vault.js';
import { web3Utils } from '../blockchain/web3.js';
import { VAULT_ADDRESS } from '../blockchain/contracts.js';

// --- Shared State Context ---
const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

const AppStateProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balances, setBalances] = useState({ usdc: 24500.00 });
  const [vaultData, setVaultData] = useState({
    totalValue: 142500.42,
    yieldEarned: 3240.12,
    initialDeposit: 139260.30
  });
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Deposit", amount: "15,000.00", token: "USDC", status: "Confirmed", time: "2 hours ago" },
    { id: 2, type: "Withdraw", amount: "2,500.00", token: "USDC", status: "Confirmed", time: "1 day ago" },
    { id: 3, type: "Deposit", amount: "50,000.00", token: "USDC", status: "Confirmed", time: "3 days ago" },
    { id: 4, type: "Harvest", amount: "420.12", token: "USDC", status: "Confirmed", time: "5 days ago" },
    { id: 5, type: "Deposit", amount: "75,000.00", token: "USDC", status: "Confirmed", time: "1 week ago" },
    { id: 6, type: "Withdraw", amount: "1,200.00", token: "USDC", status: "Confirmed", time: "2 weeks ago" },
    { id: 7, type: "Deposit", amount: "10,000.00", token: "USDC", status: "Confirmed", time: "1 month ago" },
  ]);

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      // Detect MetaMask provider
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        alert('MetaMask is not installed. Please install it to use this feature.');
        return;
      }

      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        alert('No accounts found. Please connect to MetaMask.');
        return;
      }

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      
      // Format address (show first 6 and last 4 characters)
      const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      setWalletAddress(formattedAddress);
      
      // Store full address for potential future use
      window.currentWalletAddress = address;
      
      console.log('Wallet connected:', address);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        // User rejected the request
        alert('Connection rejected. Please try again.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    delete window.currentWalletAddress;
    console.log('Wallet disconnected');
  };

  const addTransaction = (type, amount) => {
    const newTx = {
      id: Date.now(),
      type,
      amount: parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      token: "USDC",
      status: "Confirmed",
      time: "Just now"
    };
    setTransactions([newTx, ...transactions]);
  };

  const deposit = (amount) => {
    const num = parseFloat(amount);
    setBalances(prev => ({ ...prev, usdc: prev.usdc - num }));
    setVaultData(prev => ({
      ...prev,
      totalValue: prev.totalValue + num,
      initialDeposit: prev.initialDeposit + num
    }));
    addTransaction("Deposit", amount);
  };

  const withdraw = () => {
    const amount = vaultData.totalValue;
    setBalances(prev => ({ ...prev, usdc: prev.usdc + amount }));
    setVaultData({
      totalValue: 0,
      yieldEarned: 0,
      initialDeposit: 0
    });
    addTransaction("Withdraw", amount);
  };

  return (
    <AppStateContext.Provider value={{
      walletAddress,
      isConnecting,
      connectWallet,
      disconnectWallet,
      balances,
      vaultData,
      transactions,
      deposit,
      withdraw
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

// --- Components ---

const StatCard = ({ label, value, subValue, trend }) => (
  <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02]">
    <p className="text-sm text-muted-foreground mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{value}</h3>
      {trend && <span className="text-xs text-emerald-400 font-medium">{trend}</span>}
    </div>
    {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
  </div>
);

const ProtocolStat = ({ label, value }) => (
  <div className="flex flex-col gap-1 min-w-[120px]">
    <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-base md:text-lg font-semibold">{value}</span>
  </div>
);

const Dashboard = () => {
  const { vaultData } = useAppState();
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group overflow-hidden bg-primary/5 border border-primary/10 rounded-3xl p-6 md:p-12 backdrop-blur-md transition-all hover:bg-primary/[0.07]">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <div className="bg-primary/20 text-primary px-3 py-1 md:px-4 md:py-1 rounded-full text-[10px] md:text-sm font-bold border border-primary/20 animate-pulse">
            12.4% APY
          </div>
        </div>
        
        <div className="relative z-10 space-y-6 md:space-y-8">
          <div>
            <h2 className="text-[10px] md:text-sm font-medium text-primary uppercase tracking-[0.2em] mb-2 md:mb-4">Vault Overview</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-24">
              <div>
                <p className="text-muted-foreground text-xs md:text-sm mb-1">Total Value</p>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">${vaultData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
              </div>
              <div className="flex gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm mb-1">Yield Earned</p>
                  <p className="text-lg md:text-2xl font-bold text-emerald-400">+${vaultData.yieldEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm mb-1">Initial Deposit</p>
                  <p className="text-lg md:text-2xl font-semibold text-white/90">${vaultData.initialDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-24 md:h-32 w-full flex items-end gap-1 px-2 pt-4 md:pt-8">
            {[40, 45, 42, 48, 55, 52, 58, 62, 60, 65, 70, 68, 75, 82, 80, 85, 90, 88, 95, 100].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 rounded-t-sm transition-all duration-500 hover:bg-primary/40" 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard label="Available Liquidity" value="$84.2M" subValue="USDC/USDT Pool" />
        <StatCard label="Active Strategy" value="Delta Neutral" trend="OPTIMIZED" />
        <StatCard label="Next Harvest" value="14h 22m" subValue="Estimated +$420" />
      </div>

      <div className="bg-white/[0.02] border border-white/[0.02] rounded-2xl p-6 md:p-8 flex flex-wrap gap-x-12 md:gap-x-20 gap-y-6 md:gap-y-8">
        <ProtocolStat label="Total Value Locked" value="$248.5M" />
        <ProtocolStat label="Utilization Rate" value="94.2%" />
        <ProtocolStat label="Active Depositors" value="12,402" />
        <ProtocolStat label="Safety Score" value="9.8 / 10" />
      </div>
    </div>
  );
};

const Deposit = () => {
  const { walletAddress, balances, deposit } = useAppState();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loadingStage, setLoadingStage] = useState(""); // "approving" or "depositing"

  const isWalletConnected = !!walletAddress;

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    setLoading(true);
    setError("");
    setSuccess(false);
    setTxHash("");
    setLoadingStage("");

    try {
      console.log('Starting deposit flow for amount:', amount);
      
      // Initialize vault service
      await vaultService.initialize();
      
      // Execute full deposit flow (approve + deposit)
      const result = await vaultService.fullDepositFlow(amount);
      
      if (result.success) {
        console.log('Deposit successful:', result);
        
        // Update local state
        deposit(amount);
        
        // Set success state with transaction info
        setSuccess(true);
        setTxHash(result.depositTxHash);
        setAmount("");
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.error || 'Deposit failed');
      }
      
    } catch (error) {
      console.error('Deposit error:', error);
      setError(error.message);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3">Capital Allocation</h1>
          <p className="text-lg text-slate-400">Allocate USDC to the automated yield strategy vault</p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 rounded-[3rem] p-8 bg-slate-900/30 border border-slate-800/30 backdrop-blur-sm">
          {/* Primary Action Area - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Capital Input Section */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-[3rem] p-8 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Input Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Deposit Amount</label>
                    <p className="text-slate-500 text-sm mt-1">Enter capital to allocate</p>
                  </div>
                  <button 
                    onClick={() => setAmount(balances.usdc.toString())}
                    disabled={!isWalletConnected || loading}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                  >
                    Available: {balances.usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
                  </button>
                </div>

                {/* Main Input Area */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={!isWalletConnected || loading}
                        className="w-full bg-transparent text-6xl md:text-7xl font-light text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-3 pb-2">
                      <button 
                        onClick={() => setAmount(balances.usdc.toString())}
                        disabled={!isWalletConnected || loading}
                        className="px-4 py-2 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700/70 disabled:opacity-50 transition-all"
                      >
                        MAX
                      </button>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded-lg">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">$</span>
                        </div>
                        <span className="font-medium text-white">USDC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Messages */}
                {!isWalletConnected && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-amber-200 text-sm font-medium">Connect wallet to allocate capital</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && txHash && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-emerald-200 text-sm font-medium mb-2">Capital allocated successfully</p>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                    >
                      View transaction →
                    </a>
                  </div>
                )}

                {/* Allocation Confirmation */}
                <button 
                  disabled={!isWalletConnected || loading || !amount}
                  onClick={handleDeposit}
                  className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                    loading 
                      ? "bg-slate-700/50 text-slate-400 cursor-not-allowed" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing allocation...
                    </span>
                  ) : success ? (
                    "Allocation Confirmed"
                  ) : (
                    "Allocate Capital"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Context Area - 1 column */}
          <div className="space-y-6">
            {/* Strategy Overview */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Active Strategy</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium">Automated Yield Optimization</p>
                  <p className="text-slate-400 text-sm mt-1">Multi-strategy allocation across <span className="text-purple-400 font-medium">DeFi protocols</span></p>
                </div>
                <div className="pt-3 border-t border-slate-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk Profile</span>
                    <span className="text-emerald-400 font-medium">Conservative</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-400">Rebalancing</span>
                    <span className="text-blue-400 font-medium">Automated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yield Projections */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Yield Projections</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-sm">Expected APY</span>
                    <span className="text-2xl font-light text-white">8.4% - 14.2%</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Variable based on <span className="text-amber-400 font-medium">market conditions</span></p>
                </div>
                <div className="pt-3 border-t border-slate-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Historical Average</span>
                    <span className="text-green-400 font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-400">30-Day Volatility</span>
                    <span className="text-cyan-400 font-medium">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Context */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Vault Context</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Assets</span>
                  <span className="text-indigo-400 font-medium">$2.4M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Utilization</span>
                  <span className="text-orange-400 font-medium">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Liquidity Depth</span>
                  <span className="text-teal-400 font-medium">High</span>
                </div>
                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Capital is deployed across <span className="text-violet-400 font-medium">multiple liquidity pools</span> and <span className="text-pink-400 font-medium">lending protocols</span> to optimize yield while maintaining risk parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Information */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Risk Considerations</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>• <span className="text-blue-300 font-medium">Smart contract risk</span> mitigated by audits</p>
                <p>• <span className="text-purple-300 font-medium">Impermanent loss</span> managed through rebalancing</p>
                <p>• <span className="text-green-300 font-medium">Protocol diversification</span> reduces concentration risk</p>
                <p>• <span className="text-amber-300 font-medium">No lockup periods</span> - capital remains liquid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Withdraw = () => {
  const { walletAddress, vaultData, withdraw } = useAppState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [userBalance, setUserBalance] = useState("0.00");

  const isWalletConnected = !!walletAddress;
  const hasBalance = parseFloat(userBalance) > 0;

  // Fetch user's vault balance on component mount and when wallet changes
  useEffect(() => {
    if (walletAddress) {
      fetchUserBalance();
    }
  }, [walletAddress]);

  // Debounced balance refresh to prevent excessive calls
  const balanceTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (walletAddress && vaultData.totalValue > 0) {
      // Clear existing timeout
      if (balanceTimeoutRef.current) {
        clearTimeout(balanceTimeoutRef.current);
      }
      
      // Set new timeout for balance refresh
      balanceTimeoutRef.current = setTimeout(() => {
        fetchUserBalance();
      }, 1000); // 1 second delay
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (balanceTimeoutRef.current) {
        clearTimeout(balanceTimeoutRef.current);
      }
    };
  }, [vaultData.totalValue, walletAddress]);

  const fetchUserBalance = async () => {
    try {
      await vaultService.initialize();
      
      // Get principal balance (user's deposited amount)
      const principal = await vaultService.getVaultBalance();
      console.log('📊 User principal balance:', principal);
      
      // Get withdrawable balance (principal + accrued yield)
      const withdrawable = await vaultService.getWithdrawableBalance();
      console.log('💰 User withdrawable balance:', withdrawable);
      
      // Get accrued yield
      const yieldAmount = await vaultService.getUserYield();
      console.log('🌱 User accrued yield:', yieldAmount);
      
      // Update user balance to show withdrawable amount
      setUserBalance(withdrawable);
      
      // Update vault data with real values
      setVaultData({
        totalValue: parseFloat(withdrawable),
        yieldEarned: parseFloat(yieldAmount),
        initialDeposit: parseFloat(principal)
      });
      
    } catch (error) {
      console.error('Error fetching vault balance:', error);
      setUserBalance("0.00");
      setVaultData({
        totalValue: 0,
        yieldEarned: 0,
        initialDeposit: 0
      });
    }
  };

  const handleWithdrawAction = async () => {
    if (!hasBalance) return;
    
    setLoading(true);
    setError("");
    setSuccess(false);
    setTxHash("");

    try {
      console.log('Starting withdraw flow...');
      
      // Initialize vault service
      await vaultService.initialize();
      
      // Execute withdraw
      const result = await vaultService.withdrawUSDC();
      
      if (result.success) {
        console.log('Withdraw successful:', result);
        
        // Update local state
        const withdrawAmount = parseFloat(userBalance);
        withdraw(withdrawAmount);
        
        // Reset user balance
        setUserBalance("0.00");
        
        // Set success state with transaction info
        setSuccess(true);
        setTxHash(result.txHash);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.error || 'Withdraw failed');
      }
      
    } catch (error) {
      console.error('Withdraw error:', error);
      setError(error.message);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3">Capital Control</h1>
          <p className="text-lg text-slate-400">Withdraw capital from the automated yield strategy vault</p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 rounded-[3rem] p-8 bg-slate-900/30 border border-slate-800/30 backdrop-blur-sm">
          {/* Primary Action Area - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Display Section */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-[3rem] p-8 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Balance Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Available Capital</label>
                    <p className="text-slate-500 text-sm mt-1">Total withdrawable amount</p>
                  </div>
                  <button 
                    onClick={fetchUserBalance}
                    disabled={!isWalletConnected || loading}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                  >
                    Refresh Balance
                  </button>
                </div>

                {/* Main Balance Display */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="text-6xl md:text-7xl font-light text-white">
                      ${parseFloat(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">$</span>
                      </div>
                      <span className="font-medium text-white">USDC</span>
                    </div>
                  </div>
                </div>

                {/* Balance Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Principal</p>
                    <p className="text-2xl font-light text-white">
                      ${parseFloat(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">Initial deposit</p>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Yield Earned</p>
                    <p className="text-2xl font-light text-emerald-400">
                      +$0.00
                    </p>
                    <p className="text-slate-500 text-xs mt-1">Generated returns</p>
                  </div>
                </div>

                {/* Status Messages */}
                {!isWalletConnected && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-amber-200 text-sm font-medium">Connect wallet to withdraw capital</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && txHash && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-emerald-200 text-sm font-medium mb-2">Capital withdrawn successfully</p>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                    >
                      View transaction →
                    </a>
                  </div>
                )}

                {/* Withdraw Confirmation */}
                <button 
                  disabled={!isWalletConnected || loading || !hasBalance}
                  onClick={handleWithdrawAction}
                  className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                    loading 
                      ? "bg-slate-700/50 text-slate-400 cursor-not-allowed" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing withdrawal...
                    </span>
                  ) : success ? (
                    "Withdrawal Complete"
                  ) : hasBalance ? (
                    "Withdraw Full Balance"
                  ) : (
                    "No Capital to Withdraw"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Context Area - 1 column */}
          <div className="space-y-6">
            {/* Withdrawal Terms */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Withdrawal Terms</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">No Lockup Periods</p>
                    <p className="text-slate-400 text-xs mt-1">Capital remains <span className="text-emerald-400 font-medium">liquid at all times</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Zero Exit Fees</p>
                    <p className="text-slate-400 text-xs mt-1"><span className="text-blue-400 font-medium">No penalties</span> for withdrawal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Instant Processing</p>
                    <p className="text-slate-400 text-xs mt-1"><span className="text-purple-400 font-medium">Immediate fund transfer</span> on approval</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Information */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Network Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network</span>
                  <span className="text-indigo-400 font-medium">Ethereum Sepolia</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Estimated Gas</span>
                  <span className="text-orange-400 font-medium">~$0.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Confirmation Time</span>
                  <span className="text-cyan-400 font-medium">~2 minutes</span>
                </div>
                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Withdrawals are processed as <span className="text-violet-400 font-medium">single transactions</span> that transfer your entire balance back to your wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Tax Considerations</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium text-sm mb-2">Withdrawal Events</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Each withdrawal may have <span className="text-amber-400 font-medium">tax implications</span>. Consult with a tax professional for guidance on your specific situation.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Cost Basis</span>
                    <span className="text-green-400 font-medium">Tracked</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-400">Yield Reporting</span>
                    <span className="text-teal-400 font-medium">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Information */}
            <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Important Notes</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>• Withdrawals transfer <span className="text-blue-300 font-medium">full balance</span> including earned yield</p>
                <p>• <span className="text-purple-300 font-medium">Network gas fees</span> apply to each withdrawal transaction</p>
                <p>• Yield calculations stop at <span className="text-pink-300 font-medium">withdrawal execution time</span></p>
                <p>• Consider <span className="text-yellow-300 font-medium">market timing</span> for optimal withdrawal strategy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const { walletAddress } = useAppState();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transaction history from blockchain
  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const { transactionHistoryService } = await import('../blockchain/history.js');
      const history = await transactionHistoryService.getTransactionHistory(walletAddress);
      setTransactions(history);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 md:p-8 backdrop-blur-md overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Activity</h2>
            <p className="text-muted-foreground text-xs md:text-sm">Your recent interactions with AutoYield vaults.</p>
          </div>
          <button 
            onClick={fetchTransactionHistory}
            className="text-[10px] md:text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:border-primary/20"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No transactions found</p>
            <p className="text-muted-foreground text-xs mt-2">Deposit and withdraw USDC to see your transaction history</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <div className="min-w-[600px] px-6 md:px-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                      <th className="pb-4 font-medium">Type</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors cursor-default">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs transition-all group-hover:scale-110 ${
                              tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 
                              tx.type === 'Withdraw' ? 'bg-amber-500/10 text-amber-500' : 
                              'bg-primary/10 text-primary'
                            }`}>
                              {tx.type[0]}
                            </div>
                            <div>
                              <span className="font-semibold text-sm md:text-base">{tx.type}</span>
                              {tx.txHash && (
                                <a 
                                  href={tx.etherscanUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-[10px] text-primary hover:text-primary/80 transition-colors"
                                >
                                  View on Etherscan
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-mono text-xs md:text-sm">{tx.amount} {tx.token}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] md:text-xs text-white/80">{tx.status}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-[10px] md:text-xs text-muted-foreground">{tx.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] md:text-xs text-muted-foreground hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                View all transactions on Etherscan
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const NavLink = ({ href, children }) => {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link href={href} className={`px-4 py-2 rounded-md transition-all duration-300 relative group ${
      isActive 
        ? "text-primary font-medium" 
        : "text-muted-foreground hover:text-foreground"
    }`}>
      {children}
      {isActive && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />}
      {!isActive && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary/0 group-hover:bg-primary/20 rounded-full transition-all duration-300" />}
    </Link>
  );
};

// --- App Root ---

function AppContent() {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background font-sans relative overflow-hidden flex flex-col items-center text-foreground">
      <div className="absolute inset-0 web3-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl border-x border-white/[0.02] pointer-events-none" />
      
      <header className="fixed top-0 z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-background/40 backdrop-blur-xl border-b border-white/[0.02]">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6 md:gap-12">
            <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tighter transition-all hover:brightness-110">
              <Layers className="w-8 h-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Strata
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/deposit">Deposit</NavLink>
              <NavLink href="/withdraw">Withdraw</NavLink>
              <NavLink href="/history">History</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={disconnectWallet}
                  className="px-4 py-1.5 md:px-6 md:py-2 bg-emerald-600 text-white rounded-full text-xs md:text-sm font-medium hover:bg-emerald-700 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {walletAddress}
                </button>
                <button 
                  onClick={disconnectWallet}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                  title="Disconnect Wallet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-4 py-1.5 md:px-6 md:py-2 bg-primary text-primary-foreground rounded-full text-xs md:text-sm font-medium hover:brightness-110 transition-all active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
            
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current" />
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/[0.05] p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium">Dashboard</Link>
            <Link href="/deposit" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium">Deposit</Link>
            <Link href="/withdraw" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium">Withdraw</Link>
            <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium">History</Link>
          </div>
        )}
      </header>

      <main className="relative z-10 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <div className="py-12 md:py-24 flex flex-col items-center justify-center">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/deposit" component={Deposit} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/history" component={History} />
            <Route>
              <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-6xl font-bold tracking-tighter text-primary">404</h1>
                <p className="text-muted-foreground text-lg">Page not found.</p>
                <Link href="/" className="bg-white/5 px-6 py-2 rounded-xl hover:bg-white/10 transition-colors">Return home</Link>
              </div>
            </Route>
          </Switch>
        </div>
      </main>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-primary/5 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
