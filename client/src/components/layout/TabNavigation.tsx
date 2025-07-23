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
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 border-b-2 py-2 px-1 font-medium transition-colors ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
