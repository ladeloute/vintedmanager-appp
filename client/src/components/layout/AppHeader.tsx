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
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo futuriste */}
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                <Store className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VintedManager
              </h1>
              <div className="text-xs text-white/60 font-mono">AI-POWERED MANAGEMENT</div>
            </div>
          </div>

          {/* Navigation holographique */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl transition-all duration-500 ${
                  activeTab === id 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30" 
                    : "hover:bg-white/5 hover:border hover:border-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-lg transition-all duration-300 ${
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

          {/* Indicateur de statut */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="text-xs text-white/60 font-mono">ONLINE</div>
          </div>
        </div>
      </div>
    </header>
  );
}
