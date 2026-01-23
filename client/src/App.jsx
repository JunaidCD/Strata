import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";

const Dashboard = () => (
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
    <p className="text-muted-foreground">Welcome to your Web3 command center.</p>
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
        <div className="py-24 flex flex-col items-center justify-center min-h-[60vh]">
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
