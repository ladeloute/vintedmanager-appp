import { Store } from "lucide-react";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="relative text-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo futuriste - Mobile/Desktop */}
          <div className="flex items-center space-x-2 sm:space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg sm:rounded-xl blur opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3">
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VintedManager
              </h1>
              <div className="text-xs text-white/60 font-mono hidden sm:block">AI-POWERED MANAGEMENT</div>
              <div className="text-xs text-white/60 font-mono sm:hidden">AI-POWERED</div>
            </div>
          </div>

          {/* Indicateur de statut - Mobile/Desktop */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="text-xs text-white/60 font-mono">ONLINE</div>
          </div>
        </div>
      </div>
    </header>
  );
}