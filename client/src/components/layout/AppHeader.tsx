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
    <header className="bg-primary text-white shadow-material-2 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="w-6 h-6" />
            <h1 className="text-xl font-medium">VintedManager</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors hover:bg-blue-600 ${
                  activeTab === id ? "bg-blue-600" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
