import { LayoutDashboard, Sparkles, MessageCircle, Package } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "generator", label: "Générateur IA", icon: Sparkles },
    { id: "assistant", label: "Assistant réponses", icon: MessageCircle },
    { id: "articles", label: "Gestion articles", icon: Package },
  ];

  return (
    <div className="mb-4 sm:mb-8">
      {/* Navigation Quantique */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl sm:rounded-2xl blur"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-1 sm:p-2">
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-2">
            {tabs.map(({ id, label, icon: Icon }, index) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`group relative flex-1 px-6 py-4 rounded-xl transition-all duration-500 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-cyan-500/30 to-purple-600/30 border border-cyan-500/50"
                    : "hover:bg-white/5 hover:border hover:border-white/10"
                }`}
              >
                <div className="flex flex-row items-center justify-center space-x-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    activeTab === id 
                      ? "bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25" 
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      activeTab === id ? "text-white" : "text-white/60 group-hover:text-white/80"
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-medium transition-all duration-300 leading-tight ${
                      activeTab === id ? "text-white" : "text-white/60 group-hover:text-white/80"
                    }`}>
                      {label}
                    </div>
                    {activeTab === id && (
                      <div className="text-xs text-cyan-400 font-mono mt-1">ACTIVE</div>
                    )}
                  </div>
                </div>
                
                {/* Effet de particules pour l'onglet actif */}
                {activeTab === id && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute top-4 right-3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation - Style futuriste compact */}
          <nav className="sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(({ id, label, icon: Icon }, index) => (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`group relative p-3 rounded-lg transition-all duration-500 ${
                    activeTab === id
                      ? "bg-gradient-to-br from-cyan-500/30 via-purple-600/30 to-pink-500/30 border border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                      : "bg-black/30 hover:bg-white/5 border border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                      activeTab === id 
                        ? "bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30" 
                        : "bg-white/10 group-hover:bg-white/20"
                    }`}>
                      <Icon className={`w-4 h-4 transition-all duration-300 ${
                        activeTab === id ? "text-white" : "text-white/60 group-hover:text-white/80"
                      }`} />
                      
                      {/* Effet de glow pour l'icône active */}
                      {activeTab === id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-purple-600/50 rounded-lg blur animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-xs font-medium transition-all duration-300 leading-tight ${
                        activeTab === id ? "text-white" : "text-white/60 group-hover:text-white/80"
                      }`}>
                        {label.split(' ')[0]}
                      </div>
                      {activeTab === id && (
                        <div className="text-xs text-cyan-400 font-mono animate-pulse">●</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Effets de particules pour l'onglet actif mobile */}
                  {activeTab === id && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                      <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping delay-300"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping delay-500"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping delay-700"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
      
      {/* Ligne de progression quantique */}
      <div className="mt-4 relative">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-1000"
            style={{
              width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
