import { } from 'react'; // React import removed to fix TS error
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-emerald-500/30 font-sans">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="w-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* O usuário precisa colocar a logo fisicamente como detalhado na instrução */}
              <div className="relative group">
                <img 
                  src="/logo.png" 
                  alt="ElevateX" 
                  className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.2)] block"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
                <div className="hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 items-center justify-center font-bold text-base sm:text-lg shadow-lg shadow-emerald-500/20 text-white">
                  EX
                </div>
              </div>
              <span className="font-bold tracking-tight text-lg sm:text-xl text-white">ELEVATEX <span className="hidden xs:inline text-emerald-500">PROSPECT</span></span>
            </div>
            <div className="flex items-center gap-4 sm:gap-8 text-sm font-medium text-zinc-400">
              <span className="hidden sm:block cursor-pointer text-white transition-colors">Dashboard</span>
              <span className="hidden sm:block cursor-pointer hover:text-white transition-colors">CRM Leads</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                V
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full px-6 sm:px-8 lg:px-12 py-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
