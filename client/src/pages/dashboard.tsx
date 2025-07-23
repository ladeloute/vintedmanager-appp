import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Euro, Package, BarChart3, CheckCircle, Sparkles, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MonthlySalesChart, BrandDistributionChart } from "@/components/charts/StatsChart";
import type { DashboardStats } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      title: "Articles vendus ce mois",
      value: stats?.monthlyItemsSold || 0,
      icon: TrendingUp,
      color: "border-l-4 border-success",
      textColor: "text-success",
    },
    {
      title: "Revenus ce mois",
      value: `${stats?.monthlyRevenue || 0}€`,
      icon: Euro,
      color: "border-l-4 border-accent",
      textColor: "text-accent",
    },
    {
      title: "Total articles vendus",
      value: stats?.totalItemsSold || 0,
      icon: Package,
      color: "border-l-4 border-primary",
      textColor: "text-primary",
    },
    {
      title: "Coefficient moyen",
      value: `${stats?.averageCoefficient || 0}x`,
      icon: BarChart3,
      color: "border-l-4 border-secondary",
      textColor: "text-secondary",
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlySalesChart />
        <BrandDistributionChart />
      </div>

      {/* Recent Activity */}
      <Card className="shadow-material-1">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Activité récente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`flex items-center space-x-4 p-3 ${activity.color}`}>
                <activity.icon className={`${activity.textColor} w-5 h-5`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-text-secondary">
                    {activity.time} {activity.amount && `• ${activity.amount}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
