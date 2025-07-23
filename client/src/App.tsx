import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/layout/AppHeader";
import TabNavigation from "@/components/layout/TabNavigation";
import Dashboard from "@/pages/dashboard";
import AIGenerator from "@/pages/ai-generator";
import ChatAssistant from "@/pages/chat-assistant";
import ArticleManagement from "@/pages/article-management";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "generator":
        return <AIGenerator />;
      case "assistant":
        return <ChatAssistant />;
      case "articles":
        return <ArticleManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
          {/* Futuristic Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-purple-900/40 to-black/60 backdrop-blur-xl border-b border-white/10"></div>
            <div className="relative z-10">
              <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent)]"></div>
            <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
              {/* Futuristic Tab Navigation */}
              <div className="mb-8">
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              
              {/* Content with Glassmorphism Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-3xl border border-white/5"></div>
                <div className="relative z-10 p-1">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
