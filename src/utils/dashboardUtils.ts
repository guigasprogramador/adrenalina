import { Leader } from "@/types/database.types";
import { Stats } from "@/types/dashboard";

export const calculateStats = (data: Leader[]): Stats => {
  const activeLeaders = data.filter(leader => leader.active).length;
  const totalMeta = data.reduce((sum, item) => sum + item.meta, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalPercentage = totalMeta > 0 ? Math.round((totalCompleted / totalMeta) * 100) : 0;

  return {
    totalMeta,
    totalCompleted,
    totalPercentage,
    activeLeaders
  };
};

export const getPercentageColor = (percentage: number): string => {
  if (percentage >= 100) return "text-green-600 font-bold";
  if (percentage >= 70) return "text-yellow-600";
  return "text-red-600";
};