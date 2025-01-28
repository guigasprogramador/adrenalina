export interface DashboardStats {
  totalMetas: number;
  totalFaltas: number;
  overallPercentage: number;
}

export type Stats = {
  totalMeta: number;
  totalCompleted: number;
  totalPercentage: number;
  activeLeaders: number;
};