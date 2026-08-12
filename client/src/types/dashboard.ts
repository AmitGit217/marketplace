export interface DashboardData {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  monthlySales: number;
  monthlyRevenue: number;
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
}