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
    <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Deposit Assets</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Add USDC to start earning automated yield.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-black/20 border border-white/[0.05] rounded-2xl p-4 transition-all duration-200 ring-primary/0 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/20">
            <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground mb-2">
              <span>Amount</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setAmount(balances.usdc.toString())}>
                Balance: {balances.usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isWalletConnected || loading}
                className="bg-transparent text-2xl md:text-3xl font-bold w-full outline-none placeholder:text-white/10 disabled:opacity-50 transition-opacity"
              />
              <button 
                onClick={() => setAmount(balances.usdc.toString())}
                disabled={!isWalletConnected || loading}
                className="px-3 py-1 bg-primary/10 text-primary text-[10px] md:text-xs font-bold rounded-md hover:bg-primary/20 disabled:opacity-50 transition-all hover:scale-105"
              >
                MAX
              </button>
              <div className="flex items-center gap-2 bg-white/5 px-2 md:px-3 py-1.5 rounded-xl border border-white/5 shrink-0">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold">S</div>
                <span className="font-bold text-xs md:text-sm">USDC</span>
              </div>
            </div>
          </div>

          {!isWalletConnected && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-5 h-5 shrink-0 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">!</div>
              <p className="text-[10px] md:text-xs text-amber-200/80 leading-relaxed">
                Wallet not connected. Please connect your wallet to interact with the vault.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-5 h-5 shrink-0 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold">✕</div>
              <div className="flex-1">
                <p className="text-[10px] md:text-xs text-red-200/80 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && txHash && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">✓</div>
              <div className="flex-1">
                <p className="text-[10px] md:text-xs text-emerald-200/80 leading-relaxed mb-2">
                  Deposit successful! Your USDC has been added to the vault.
                </p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] md:text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
                >
                  View transaction on Etherscan
                </a>
              </div>
            </div>
          )}

          <button 
            disabled={!isWalletConnected || loading || !amount}
            onClick={handleDeposit}
            className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all active:scale-[0.98] ${
              loading 
                ? "bg-primary/50 cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:brightness-110"
            } disabled:opacity-30 disabled:shadow-none disabled:hover:brightness-100`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing transaction...
              </span>
            ) : success ? (
              <span className="animate-in zoom-in duration-300">Deposit Successful!</span>
            ) : (
              "Deposit"
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between text-[10px] md:text-xs">
            <span className="text-muted-foreground">Protocol Fee</span>
            <span>0.00%</span>
          </div>
          <div className="flex justify-between text-[10px] md:text-xs">
            <span className="text-muted-foreground">Est. Annual Yield</span>
            <span className="text-emerald-400 font-bold">+12.4%</span>
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
      const balance = await vaultService.getVaultBalance();
      console.log('📊 Setting user balance to:', balance);
      setUserBalance(balance);
    } catch (error) {
      console.error('Error fetching vault balance:', error);
      setUserBalance("0.00");
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
    <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Withdraw Assets</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Move your funds back to your connected wallet.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-black/20 border border-white/[0.05] rounded-2xl p-6 transition-all hover:bg-black/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-1">Available to Withdraw</p>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">${parseFloat(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</h3>
              </div>
              <button 
                onClick={fetchUserBalance}
                className="text-[10px] md:text-xs text-primary hover:text-primary/80 transition-colors bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 hover:border-primary/20"
              >
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase mb-1">Principal</p>
                <p className="text-xs md:text-sm font-semibold text-white/90">${parseFloat(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase mb-1">Net Yield</p>
                <p className="text-xs md:text-sm font-semibold text-emerald-400">+$0.00</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-5 h-5 shrink-0 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold">✕</div>
              <div className="flex-1">
                <p className="text-[10px] md:text-xs text-red-200/80 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && txHash && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">✓</div>
              <div className="flex-1">
                <p className="text-[10px] md:text-xs text-emerald-200/80 leading-relaxed mb-2">
                  Withdraw successful! Your USDC has been transferred back to your wallet.
                </p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] md:text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
                >
                  View transaction on Etherscan
                </a>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-4 flex gap-3 border border-white/[0.02]">
            <div className="w-5 h-5 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">i</div>
            <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
              AutoYield features <span className="text-white font-medium">zero exit fees</span> and <span className="text-white font-medium">no lockup periods</span>. Your funds are available instantly.
            </p>
          </div>

          <button 
            disabled={!isWalletConnected || loading || !hasBalance}
            onClick={handleWithdrawAction}
            className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all active:scale-[0.98] ${
              loading 
                ? "bg-white/10 text-white/30 cursor-not-allowed" 
                : "bg-white text-black hover:bg-white/90 hover:shadow-lg"
            } disabled:opacity-30`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Processing transaction...
              </span>
            ) : success ? (
              <span className="animate-in zoom-in duration-300">Withdrawal Complete!</span>
            ) : (
              "Withdraw Full Balance"
            )}
          </button>
        </div>

        {!isWalletConnected && (
          <p className="text-center text-[10px] md:text-xs text-amber-200/60 font-medium">
            Please connect your wallet to withdraw funds.
          </p>
        )}
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
