import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stats } from "@/types/dashboard";

interface StatCardProps {
  stats: Stats;
}

export function StatCard({ stats }: StatCardProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total de Líderes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.activeLeaders}</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Meta Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalMeta}</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total de Inscrições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalCompleted}</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Percentual Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-xl sm:text-2xl font-bold ${stats.totalPercentage >= 100 ? 'text-green-600' : stats.totalPercentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {stats.totalPercentage}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}