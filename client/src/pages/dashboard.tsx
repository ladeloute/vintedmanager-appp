import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Euro, Package, BarChart3, CheckCircle, Sparkles, Plus, Zap, Target, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total articles",
      value: stats?.totalArticles || 0,
      icon: Package,
      color: "border-l-4 border-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Articles vendus ce mois",
      value: stats?.monthlyItemsSold || 0,
      icon: TrendingUp,
      color: "border-l-4 border-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Revenus ce mois",
      value: `${stats?.monthlyRevenue || 0}€`,
      icon: Euro,
      color: "border-l-4 border-orange-500",
      textColor: "text-orange-600",
    },
    {
      title: "Revenus totaux",
      value: `${stats?.totalRevenue || 0}€`,
      icon: Euro,
      color: "border-l-4 border-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Total articles vendus",
      value: stats?.totalItemsSold || 0,
      icon: CheckCircle,
      color: "border-l-4 border-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      title: "Prix moyen",
      value: `${stats?.averageCoefficient || 0}€`,
      icon: BarChart3,
      color: "border-l-4 border-indigo-500",
      textColor: "text-indigo-600",
    },
  ];

  // Calculate performance metrics
  const totalRevenue = parseFloat(stats?.totalRevenue || "0");
  const monthlyRevenue = parseFloat(stats?.monthlyRevenue || "0");
  const soldPercentage = stats?.totalArticles ? Math.round((stats.totalItemsSold / stats.totalArticles) * 100) : 0;
  const avgPrice = parseFloat(stats?.averageCoefficient || "0");

  const performanceCards = [
    {
      title: "Performance de vente",
      value: `${soldPercentage}%`,
      subtitle: "Articles vendus",
      trend: soldPercentage > 50 ? "up" : "down",
      color: "from-emerald-500 to-green-600",
      icon: Target,
    },
    {
      title: "Activité mensuelle",
      value: stats?.monthlyItemsSold || 0,
      subtitle: "Ventes ce mois",
      trend: "up",
      color: "from-blue-500 to-cyan-600",
      icon: Activity,
    },
    {
      title: "Revenue moyen",
      value: `${avgPrice.toFixed(0)}€`,
      subtitle: "Par article vendu",
      trend: avgPrice > 20 ? "up" : "down", 
      color: "from-purple-500 to-pink-600",
      icon: Zap,
    },
  ];

  const recentActivity = [
    {
      type: "sale",
      message: "Pull Nike taille M vendu",
      time: "Il y a 2 heures",
      amount: "25€",
      icon: CheckCircle,
      color: "border-l-2 border-success bg-green-50",
      textColor: "text-success",
    },
    {
      type: "generation",
      message: "Description générée pour Veste Zara",
      time: "Il y a 4 heures",
      icon: Sparkles,
      color: "border-l-2 border-accent bg-orange-50",
      textColor: "text-accent",
    },
    {
      type: "add",
      message: "Nouvel article ajouté: T-shirt Adidas",
      time: "Hier • Taille L • 18€",
      icon: Plus,
      color: "border-l-2 border-primary bg-blue-50",
      textColor: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 space-y-8 p-6">
      {/* Animated Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
          VintedManager Dashboard
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Holographic Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {performanceCards.map((card, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse"></div>
            <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500">
              <CardContent className="p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-2xl transform group-hover:rotate-12 transition-transform duration-500`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                      <div className="text-xs text-cyan-400 font-mono">LIVE</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">{card.title}</h3>
                  <div className="flex items-baseline space-x-3 mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                      {card.value}
                    </span>
                    <span className="text-sm text-white/40">{card.subtitle}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 animate-pulse`}
                      style={{
                        width: card.title.includes('Performance') ? `${soldPercentage}%` : 
                               card.title.includes('mensuelle') ? '75%' : '60%'
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quantum Revenue Center */}
      <div className="relative group mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
        <Card className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden">
          <CardContent className="p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Centre de Revenus Quantique
                </h3>
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Revenue */}
                <div className="relative group/card">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl blur group-hover/card:blur-none transition-all duration-500"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/60 transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-emerald-400 text-xs font-mono">MENSUEL</div>
                    </div>
                    <div className="text-sm text-white/60 mb-2">Revenus ce mois</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      {stats?.monthlyRevenue || 0}€
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="relative group/card">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl blur group-hover/card:blur-none transition-all duration-500"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/60 transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                        <Euro className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-purple-400 text-xs font-mono">TOTAL</div>
                    </div>
                    <div className="text-sm text-white/60 mb-2">Revenus totaux</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {stats?.totalRevenue || 0}€
                    </div>
                  </div>
                </div>

                {/* Performance Sphere */}
                <div className="relative group/card flex items-center justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center group-hover/card:scale-110 transition-all duration-700">
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {soldPercentage}%
                        </div>
                        <div className="text-sm text-cyan-400 font-mono">PERFORMANCE</div>
                      </div>
                    </div>
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, rgba(34, 211, 238, 0.8) ${soldPercentage * 3.6}deg, rgba(34, 211, 238, 0.1) ${soldPercentage * 3.6}deg)`,
                        filter: 'blur(2px)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed - Futuristic Style */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Activity className="w-6 h-6 mr-3 text-cyan-400" />
                Flux d'activité
              </h3>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
            <div className="space-y-4">
              {stats?.totalArticles === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/80 mb-2">Aucune activité récente</p>
                  <p className="text-sm text-white/60">Commencez par ajouter vos premiers articles</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Articles en stock</p>
                      <p className="text-sm text-white/70">{stats?.totalArticles} articles disponibles</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{stats?.totalArticles}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Performance globale</p>
                      <p className="text-sm text-white/70">{soldPercentage}% de réussite en vente</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-400">{soldPercentage}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Euro className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Revenus générés</p>
                      <p className="text-sm text-white/70">Total de vos ventes</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-400">{stats?.totalRevenue}€</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
