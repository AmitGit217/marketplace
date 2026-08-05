import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { AuthGuard } from "../../guards/auth.guard";
import { DashboardResponse } from "./interfaces";


@UseGuards(AuthGuard)
@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
  

    @Get()
    async getDashboardData(): Promise<DashboardResponse> {
        return await this.dashboardService.getDashboardData();
    }
}