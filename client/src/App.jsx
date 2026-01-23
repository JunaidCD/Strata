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
      <a className={`px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? "bg-primary/20 text-primary border border-primary/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}>
        {children}
      </a>
    </Link>
  );
};

function App() {
  return (
    <div className="min-h-screen w-full bg-background font-sans relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 web3-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl border-x border-white/[0.02] pointer-events-none" />
      
      {/* Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-white/[0.02] bg-background/50 backdrop-blur-xl">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tighter text-primary">DEGEN</span>
            <div className="hidden md:flex items-center gap-2">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/deposit">Deposit</NavLink>
              <NavLink href="/withdraw">Withdraw</NavLink>
              <NavLink href="/history">History</NavLink>
            </div>
          </div>
          <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse" />
        </nav>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
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
