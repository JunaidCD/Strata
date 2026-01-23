import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";

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

const Dashboard = () => (
  <div className="w-full max-w-5xl mx-auto space-y-12">
    {/* Hero Overview */}
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
              <h1 className="text-6xl font-bold tracking-tighter">$142,500.42</h1>
            </div>
            <div className="flex gap-12 border-l border-white/10 pl-8">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Yield Earned</p>
                <p className="text-2xl font-bold text-emerald-400">+$3,240.12</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Initial Deposit</p>
                <p className="text-2xl font-semibold">$139,260.30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Chart Area */}
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
      
      {/* Decorative background circle */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
    </div>

    {/* Secondary Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Available Liquidity" value="$84.2M" subValue="USDC/USDT Pool" />
      <StatCard label="Active Strategy" value="Delta Neutral" trend="OPTIMIZED" />
      <StatCard label="Next Harvest" value="14h 22m" subValue="Estimated +$420" />
    </div>

    {/* Protocol Stats */}
    <div className="bg-white/[0.02] border border-white/[0.02] rounded-2xl p-8 flex flex-wrap gap-x-20 gap-y-8">
      <ProtocolStat label="Total Value Locked" value="$248.5M" />
      <ProtocolStat label="Utilization Rate" value="94.2%" />
      <ProtocolStat label="Active Depositors" value="12,402" />
      <ProtocolStat label="Safety Score" value="9.8 / 10" />
    </div>
  </div>
);

const Deposit = () => (
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-4xl font-bold tracking-tighter">Deposit</h1>
    <p className="text-muted-foreground">Securely fund your account.</p>
  </div>
);

const Withdraw = () => (
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-4xl font-bold tracking-tighter">Withdraw</h1>
    <p className="text-muted-foreground">Move your assets back to your wallet.</p>
  </div>
);

const History = () => (
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-4xl font-bold tracking-tighter">History</h1>
    <p className="text-muted-foreground">Review your transaction activity.</p>
  </div>
);

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

const WalletConnect = () => {
  const [address, setAddress] = useState(null);

  const connect = () => {
    setAddress("0x71C...3E21");
  };

  return (
    <button 
      onClick={connect}
      className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity active:scale-95"
    >
      {address || "Connect Wallet"}
    </button>
  );
};

function App() {
  return (
    <div className="min-h-screen w-full bg-background font-sans relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 web3-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl border-x border-white/[0.02] pointer-events-none" />
      
      {/* Persistent Header */}
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
          <WalletConnect />
        </nav>
      </header>

      {/* Main Container */}
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

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

export default App;
