import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Euro, Package, BarChart3, CheckCircle, Sparkles, Calculator, Percent, Activity, HelpCircle, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { DashboardStats } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <TooltipProvider>
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-black/20 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <div className="h-24 sm:h-32 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Calculer les métriques avancées
  const totalRevenue = parseFloat(stats?.totalRevenue || "0");
  const monthlyRevenue = parseFloat(stats?.monthlyRevenue || "0");
  const totalPurchasePrice = parseFloat((stats as any)?.totalPurchasePrice || "0");
  const totalMargin = totalRevenue - totalPurchasePrice;
  const marginPercentage = totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100) : 0;
  const averageCoefficient = totalPurchasePrice > 0 ? (totalRevenue / totalPurchasePrice) : 0;

  const statsCards = [
    // Section Inventaire
    {
      title: "Total articles",
      value: stats?.totalArticles || 0,
      icon: Package,
      gradient: "from-blue-500/20 to-indigo-600/20",
      border: "border-blue-500/30",
      textColor: "text-blue-400",
      bgGlow: "bg-blue-500",
      tooltip: "Nombre total d'articles dans votre inventaire",
      category: "inventory"
    },
    {
      title: "Articles vendus",
      value: stats?.totalItemsSold || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500/20 to-green-600/20",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400",
      bgGlow: "bg-emerald-500",
      tooltip: "Nombre total d'articles vendus avec succès",
      category: "inventory"
    },
    // Section Revenus
    {
      title: "Revenus totaux",
      value: `${totalRevenue.toFixed(2)}€`,
      icon: Euro,
      gradient: "from-amber-500/20 to-orange-600/20",
      border: "border-amber-500/30",
      textColor: "text-amber-400",
      bgGlow: "bg-amber-500",
      tooltip: "Chiffre d'affaires total généré par vos ventes",
      category: "revenue"
    },
    {
      title: "Revenus ce mois",
      value: `${monthlyRevenue.toFixed(2)}€`,
      icon: TrendingUp,
      gradient: "from-cyan-500/20 to-blue-600/20",
      border: "border-cyan-500/30",
      textColor: "text-cyan-400",
      bgGlow: "bg-cyan-500",
      tooltip: "Revenus générés ce mois-ci uniquement",
      category: "revenue"
    },
    // Section Performance
    {
      title: "Marge totale",
      value: `${totalMargin.toFixed(2)}€`,
      icon: Calculator,
      gradient: "from-purple-500/20 to-pink-600/20",
      border: "border-purple-500/30",
      textColor: "text-purple-400",
      bgGlow: "bg-purple-500",
      tooltip: "Bénéfice total : Prix de vente - Prix d'achat",
      category: "performance"
    },
    {
      title: "Coefficient moyen",
      value: `×${averageCoefficient.toFixed(2)}`,
      icon: Percent,
      gradient: "from-rose-500/20 to-red-600/20",
      border: "border-rose-500/30",
      textColor: "text-rose-400",
      bgGlow: "bg-rose-500",
      tooltip: "Multiplicateur moyen : Prix de vente ÷ Prix d'achat",
      category: "performance"
    },
  ];

  // Grouper les cartes par catégorie
  const inventoryCards = statsCards.filter(card => card.category === "inventory");
  const revenueCards = statsCards.filter(card => card.category === "revenue");
  const performanceCards = statsCards.filter(card => card.category === "performance");

  const StatCard = ({ card }: { card: typeof statsCards[0] }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group relative cursor-help">
          <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
          <Card className={`relative bg-black/30 backdrop-blur-2xl border ${card.border} rounded-2xl sm:rounded-3xl overflow-hidden group-hover:scale-[1.02] transition-all duration-500`}>
            <CardContent className="p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent)]"></div>
              <div className="relative z-10">
                {/* En-tête avec icône */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="relative group/icon">
                    <div className={`absolute inset-0 ${card.bgGlow} rounded-xl sm:rounded-2xl blur opacity-40 group-hover/icon:opacity-60 transition-all duration-500`}></div>
                    <div className={`relative bg-gradient-to-r ${card.gradient} backdrop-blur-xl border ${card.border} rounded-xl sm:rounded-2xl p-3 sm:p-4 group-hover/icon:scale-110 transition-all duration-500`}>
                      <card.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${card.textColor}`} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className={`w-4 h-4 ${card.textColor} opacity-60 group-hover:opacity-100 transition-all duration-300`} />
                    <div className={`w-2 h-2 ${card.bgGlow} rounded-full animate-pulse`}></div>
                  </div>
                </div>

                {/* Titre */}
                <h3 className="text-sm sm:text-base font-medium text-white/70 mb-2 sm:mb-3 uppercase tracking-wider">
                  {card.title}
                </h3>

                {/* Valeur principale */}
                <div className="flex items-baseline space-x-2 mb-4 sm:mb-6">
                  <span className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-${card.textColor.replace('text-', '')}/80 bg-clip-text text-transparent`}>
                    {card.value}
                  </span>
                </div>

                {/* Barre de progression animée */}
                <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient.replace('/20', '')} rounded-full transition-all duration-1000 animate-pulse`}
                    style={{ width: '70%' }}
                  ></div>
                </div>

                {/* Indicateur de statut */}
                <div className="flex items-center justify-between mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 ${card.bgGlow} rounded-full animate-ping`}></div>
                    <span className="text-xs text-white/50 font-mono uppercase tracking-wide">Live</span>
                  </div>
                  <Sparkles className={`w-4 h-4 ${card.textColor} opacity-40 group-hover:opacity-80 transition-all duration-300`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="bg-black/80 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-xl shadow-2xl max-w-xs"
      >
        <p className="text-sm">{card.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6 sm:space-y-10 p-4 sm:p-6">
        {/* Header Premium Futuriste */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 rounded-3xl sm:rounded-4xl blur-2xl"></div>
          <div className="relative bg-black/25 backdrop-blur-2xl border border-white/20 rounded-3xl sm:rounded-4xl p-8 sm:p-12">
            <div className="flex items-center justify-center mb-8 sm:mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-700 animate-pulse"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 group-hover:scale-110 transition-all duration-500">
                  <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 sm:mb-8 tracking-tight">
              <span className="sm:hidden">Nexus Analytics</span>
              <span className="hidden sm:inline">Centre de Performance Quantique</span>
            </h1>
            <p className="text-white/80 max-w-4xl mx-auto text-lg sm:text-xl leading-relaxed mb-8">
              <span className="sm:hidden">Données en temps réel</span>
              <span className="hidden sm:inline">Analysez vos performances commerciales avec une précision quantique et optimisez vos stratégies de vente en temps réel</span>
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>

        {/* Section Inventaire */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90">Inventaire</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {inventoryCards.map((card, index) => (
              <StatCard key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Section Revenus */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90">Revenus</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {revenueCards.map((card, index) => (
              <StatCard key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Section Performance */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90">Performance</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {performanceCards.map((card, index) => (
              <StatCard key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Résumé Global Premium */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700"></div>
          <Card className="relative bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl border border-white/20 backdrop-blur-xl">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  <span className="text-white/90 font-medium text-lg">Résumé de Performance</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      {marginPercentage.toFixed(1)}%
                    </div>
                    <div className="text-white/70 text-sm uppercase tracking-wider">Marge de profit</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {stats?.totalArticles ? Math.round((stats.totalItemsSold / stats.totalArticles) * 100) : 0}%
                    </div>
                    <div className="text-white/70 text-sm uppercase tracking-wider">Taux de vente</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      A+
                    </div>
                    <div className="text-white/70 text-sm uppercase tracking-wider">Note globale</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}