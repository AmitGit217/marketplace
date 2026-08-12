export interface DashboardData {
  inventory: {
    totalVehicles: number;
    availableVehicles: number;
    soldVehicles: number;
  };

  recent: {
    period: "last30Days";
    sales: number;
    revenue: number;
  };

  yearly: {
    year: number;
    sales: number;
    revenue: number;
  }[];

  dataThrough: Date | null;
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
}