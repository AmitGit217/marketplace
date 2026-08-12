import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma";
import { DashboardResponse } from "./interfaces";

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardData(): Promise<DashboardResponse> {
    const now = new Date();

    // Last 30 days
    const startOfLast30Days = new Date(now);
    startOfLast30Days.setDate(now.getDate() - 30);

    const [
      totalVehicles,
      availableVehicles,
      soldVehicles,
      recentSales,
      latestSale,
    ] = await this.prismaService.$transaction([
      // Inventory
      this.prismaService.vehicle.count(),

      this.prismaService.vehicle.count({
        where: {
          status: "Available",
        },
      }),

      this.prismaService.sale.count(),

      // Sales from the last 30 days
      this.prismaService.sale.findMany({
        where: {
          saleDate: {
            gte: startOfLast30Days,
            lte: now,
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

      // Most recent sale in database
      this.prismaService.sale.findFirst({
        orderBy: {
          saleDate: "desc",
        },
        select: {
          saleDate: true,
        },
      }),
    ]);

    // Recent performance
    const recentRevenue = recentSales.reduce(
      (sum, sale) => sum + Number(sale.vehicle.price),
      0,
    );

    // Historical yearly data
    const sales = await this.prismaService.sale.findMany({
      orderBy: {
        saleDate: "asc",
      },
      include: {
        vehicle: {
          select: {
            price: true,
          },
        },
      },
    });

    const yearlyMap = new Map<
      number,
      {
        sales: number;
        revenue: number;
      }
    >();

    for (const sale of sales) {
      const year = sale.saleDate.getFullYear();

      const current = yearlyMap.get(year) ?? {
        sales: 0,
        revenue: 0,
      };

      current.sales += 1;
      current.revenue += Number(sale.vehicle.price);

      yearlyMap.set(year, current);
    }

    const yearly = Array.from(yearlyMap.entries()).map(
      ([year, data]) => ({
        year,
        sales: data.sales,
        revenue: data.revenue,
      }),
    );

    return {
      message: "Dashboard data fetched successfully",
      data: {
        inventory: {
          totalVehicles,
          availableVehicles,
          soldVehicles,
        },

        recent: {
          period: "last30Days",
          sales: recentSales.length,
          revenue: recentRevenue,
        },

        yearly,

        dataThrough: latestSale?.saleDate ?? null,
      },
    };
  }
}