import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", sales: 12, revenue: 285 },
  { month: "Fév", sales: 19, revenue: 445 },
  { month: "Mar", sales: 15, revenue: 325 },
  { month: "Avr", sales: 22, revenue: 515 },
  { month: "Mai", sales: 18, revenue: 395 },
  { month: "Juin", sales: 24, revenue: 487 },
];

const brandData = [
  { name: "Zara", value: 35, color: "#1976D2" },
  { name: "H&M", value: 25, color: "#388E3C" },
  { name: "Nike", value: 20, color: "#FF6F00" },
  { name: "Adidas", value: 15, color: "#F44336" },
  { name: "Autres", value: 5, color: "#757575" },
];

export function MonthlySalesChart() {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-material-1">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <span className="material-icons mr-2">show_chart</span>
        Évolution des ventes mensuelles
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="hsl(207, 90%, 54%)" 
              strokeWidth={2}
              name="Ventes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BrandDistributionChart() {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-material-1">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <span className="material-icons mr-2">pie_chart</span>
        Répartition par marque
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={brandData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {brandData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Part"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {brandData.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-text-secondary">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
