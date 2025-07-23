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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.color} shadow-material-1`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <stat.icon className={`${stat.textColor} w-8 h-8`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceCards.map((card, index) => (
          <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {card.trend === 'up' ? '↗ Croissance' : '↘ En baisse'}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</span>
                  <span className="text-sm text-gray-500">{card.subtitle}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Visualization */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Aperçu des revenus</h3>
                <p className="text-white/80">Performance financière globale</p>
              </div>
              <Euro className="w-8 h-8 text-white/80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-white/80 mb-1">Revenus ce mois</div>
                  <div className="text-2xl font-bold">{stats?.monthlyRevenue || 0}€</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-white/80 mb-1">Revenus totaux</div>
                  <div className="text-2xl font-bold">{stats?.totalRevenue || 0}€</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{soldPercentage}%</div>
                      <div className="text-xs text-white/80">Vendus</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-white/30"
                    style={{
                      background: `conic-gradient(from 0deg, white ${soldPercentage * 3.6}deg, transparent ${soldPercentage * 3.6}deg)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
