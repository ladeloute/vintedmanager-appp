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
        <div className="min-h-screen bg-background">
          <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            {renderContent()}
          </div>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
