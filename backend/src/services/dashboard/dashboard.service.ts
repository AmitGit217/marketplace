import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma";
import { DashboardResponse } from "./interfaces";

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardData(): Promise<DashboardResponse> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
    );

    const [
      totalVehicles,
      availableVehicles,
      soldVehicles,
      monthlySales,
      monthlyRevenue,
    ] = await this.prismaService.$transaction([
      this.prismaService.vehicle.count(),

      this.prismaService.vehicle.count({
        where: {
          status: "Available",
        },
      }),

      this.prismaService.sale.count(),

      this.prismaService.sale.count({
        where: {
          saleDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      }),

      this.prismaService.sale.findMany({
        where: {
          saleDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        include: {
          vehicle: {
            select: {
              price: true,
            },
          },
        },
      }),
    ]);

    const revenue = monthlyRevenue.reduce(
      (sum, sale) => sum + Number(sale.vehicle.price),
      0,
    );

    return {
      message: "Dashboard data fetched successfully",
      data: {
        totalVehicles,
        availableVehicles,
        soldVehicles,
        monthlySales,
        monthlyRevenue: revenue,
      },
    };
  }
}