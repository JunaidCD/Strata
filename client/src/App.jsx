import { useState, createContext, useContext } from "react";
import { Switch, Route, Link, useLocation } from "wouter";

// --- Shared State Context ---
const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

const AppStateProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
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

  const connectWallet = () => setWalletAddress("0x71C...3E21");

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
      connectWallet,
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
  <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-sm">
    <p className="text-sm text-muted-foreground mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      {trend && <span className="text-xs text-emerald-400 font-medium">{trend}</span>}
    </div>
    {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
  </div>
);

const ProtocolStat = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-lg font-semibold">{value}</span>
  </div>
);

const Dashboard = () => {
  const { vaultData } = useAppState();
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="relative group overflow-hidden bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8">
          <div className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-bold border border-primary/20 animate-pulse">
            12.4% APY
          </div>
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">Vault Overview</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-24">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Value</p>
                <h1 className="text-6xl font-bold tracking-tighter">${vaultData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
              </div>
              <div className="flex gap-12 border-l border-white/10 pl-8">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Yield Earned</p>
                  <p className="text-2xl font-bold text-emerald-400">+${vaultData.yieldEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Initial Deposit</p>
                  <p className="text-2xl font-semibold">${vaultData.initialDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-32 w-full flex items-end gap-1 px-2 pt-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Available Liquidity" value="$84.2M" subValue="USDC/USDT Pool" />
        <StatCard label="Active Strategy" value="Delta Neutral" trend="OPTIMIZED" />
        <StatCard label="Next Harvest" value="14h 22m" subValue="Estimated +$420" />
      </div>

      <div className="bg-white/[0.02] border border-white/[0.02] rounded-2xl p-8 flex flex-wrap gap-x-20 gap-y-8">
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

  const isWalletConnected = !!walletAddress;

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    setLoading(true);
    setTimeout(() => {
      deposit(amount);
      setLoading(false);
      setSuccess(true);
      setAmount("");
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Deposit Assets</h2>
          <p className="text-muted-foreground text-sm">Add USDC to start earning automated yield.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-black/20 border border-white/[0.05] rounded-2xl p-4 transition-focus-within ring-primary/20 focus-within:ring-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Amount</span>
              <span>Balance: {balances.usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isWalletConnected || loading}
                className="bg-transparent text-3xl font-bold w-full outline-none placeholder:text-white/10 disabled:opacity-50"
              />
              <button 
                onClick={() => setAmount(balances.usdc.toString())}
                disabled={!isWalletConnected || loading}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md hover:bg-primary/20 disabled:opacity-50"
              >
                MAX
              </button>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">S</div>
                <span className="font-bold text-sm">USDC</span>
              </div>
            </div>
          </div>

          {!isWalletConnected && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
              <div className="w-5 h-5 shrink-0 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">!</div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Wallet not connected. Please connect your wallet to interact with the vault.
              </p>
            </div>
          )}

          <button 
            disabled={!isWalletConnected || loading || !amount}
            onClick={handleDeposit}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
              loading 
                ? "bg-primary/50 cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
            } disabled:opacity-50 disabled:shadow-none`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : success ? (
              "Success!"
            ) : (
              "Deposit"
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Protocol Fee</span>
            <span>0.00%</span>
          </div>
          <div className="flex justify-between text-xs">
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

  const isWalletConnected = !!walletAddress;

  const handleWithdrawAction = () => {
    if (vaultData.totalValue <= 0) return;
    setLoading(true);
    setTimeout(() => {
      withdraw();
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Withdraw Assets</h2>
          <p className="text-muted-foreground text-sm">Move your funds back to your connected wallet.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-black/20 border border-white/[0.05] rounded-2xl p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Available to Withdraw</p>
            <h3 className="text-4xl font-bold tracking-tighter mb-6">${vaultData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Principal</p>
                <p className="text-sm font-semibold text-white/90">${vaultData.initialDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Net Yield</p>
                <p className="text-sm font-semibold text-emerald-400">+${vaultData.yieldEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex gap-3">
            <div className="w-5 h-5 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">i</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AutoYield features <span className="text-white font-medium">zero exit fees</span> and <span className="text-white font-medium">no lockup periods</span>. Your funds are available instantly.
            </p>
          </div>

          <button 
            disabled={!isWalletConnected || loading || vaultData.totalValue <= 0}
            onClick={handleWithdrawAction}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
              loading 
                ? "bg-white/10 text-white/30 cursor-not-allowed" 
                : "bg-white text-black hover:bg-white/90"
            } disabled:opacity-50`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Processing...
              </span>
            ) : success ? (
              "Transfer Complete"
            ) : (
              "Withdraw Full Balance"
            )}
          </button>
        </div>

        {!isWalletConnected && (
          <p className="text-center text-xs text-amber-200/60 font-medium">
            Please connect your wallet to withdraw funds.
          </p>
        )}
      </div>
    </div>
  );
};

const History = () => {
  const { transactions } = useAppState();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
            <p className="text-muted-foreground text-sm">Your recent interactions with AutoYield vaults.</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline">Export CSV</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-widest">
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 
                        tx.type === 'Withdraw' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-primary/10 text-primary'
                      }`}>
                        {tx.type[0]}
                      </div>
                      <span className="font-semibold">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-mono text-sm">{tx.amount} {tx.token}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-white/80">{tx.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-xs text-muted-foreground">{tx.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <button className="text-sm text-muted-foreground hover:text-white transition-colors">
            View all transactions on Etherscan
          </button>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ href, children }) => {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link href={href}>
      <a className={`px-4 py-2 rounded-md transition-all duration-200 ${
        isActive 
          ? "text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground"
      }`}>
        {children}
      </a>
    </Link>
  );
};

// --- App Root ---

function AppContent() {
  const { walletAddress, connectWallet } = useAppState();

  return (
    <div className="min-h-screen w-full bg-background font-sans relative overflow-hidden flex flex-col items-center text-foreground">
      <div className="absolute inset-0 web3-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl border-x border-white/[0.02] pointer-events-none" />
      
      <header className="fixed top-0 z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-background/40 backdrop-blur-xl border-b border-white/[0.02]">
        <nav className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/">
              <a className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                AutoYield
              </a>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/deposit">Deposit</NavLink>
              <NavLink href="/withdraw">Withdraw</NavLink>
              <NavLink href="/history">History</NavLink>
            </div>
          </div>
          <button 
            onClick={connectWallet}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity active:scale-95"
          >
            {walletAddress || "Connect Wallet"}
          </button>
        </nav>
      </header>

      <main className="relative z-10 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="py-24 flex flex-col items-center justify-center">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/deposit" component={Deposit} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/history" component={History} />
            <Route>
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold tracking-tighter">404</h1>
                <p className="text-muted-foreground">Route not found.</p>
                <Link href="/"><a className="text-primary hover:underline">Return home</a></Link>
              </div>
            </Route>
          </Switch>
        </div>
      </main>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
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
