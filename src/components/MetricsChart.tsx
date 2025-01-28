import { Leader } from "@/types/database.types";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MetricsChartProps {
  data: Leader[];
}

export function MetricsChart({ data }: MetricsChartProps) {
  const chartData = data.map(item => ({
    name: item.name,
    Meta: item.meta,
    Inscrições: item.completed
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Meta" fill="#3b82f6" />
          <Bar dataKey="Inscrições" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}