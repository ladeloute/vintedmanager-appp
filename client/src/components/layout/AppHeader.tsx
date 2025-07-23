import { Store, LayoutDashboard, Sparkles, MessageCircle, Package } from "lucide-react";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "generator", label: "Générateur IA", icon: Sparkles },
    { id: "assistant", label: "Assistant", icon: MessageCircle },
    { id: "articles", label: "Articles", icon: Package },
  ];

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

          {/* Navigation holographique - Desktop Only */}
          <nav className="hidden lg:flex space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`group relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-500 ${
                  activeTab === id 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30" 
                    : "hover:bg-white/5 hover:border hover:border-white/10"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-md transition-all duration-300 ${
                    activeTab === id 
                      ? "bg-gradient-to-br from-cyan-500 to-purple-600" 
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium transition-all duration-300 ${
                    activeTab === id ? "text-white" : "text-white/70 group-hover:text-white/90"
                  }`}>
                    {label}
                  </span>
                </div>
                {activeTab === id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                )}
              </button>
            ))}
          </nav>

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
