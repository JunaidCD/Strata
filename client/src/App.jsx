function App() {
  return (
    <div className="min-h-screen w-full bg-background font-sans relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 web3-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl border-x border-white/[0.02] pointer-events-none" />
      
      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="py-12 flex flex-col items-center justify-center min-h-[80vh]">
          {/* Content will go here in next steps */}
        </div>
      </main>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

export default App;
