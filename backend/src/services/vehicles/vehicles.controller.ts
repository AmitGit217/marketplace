import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { VehiclesService } from "./vehicels.service";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto";
import { AuthGuard } from "../../guards/auth.guard";
import { IsAdminGuard } from "../../guards/isAdmin.guard";

@Controller("vehicles")
@UseGuards(AuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async getVehicles() {
    return this.vehiclesService.getVehicles();
  }

  @Get(":id")
  async getVehicleById(@Param("id") id: string) {
    return this.vehiclesService.getVehicleById(id);
  }


  @UseGuards(IsAdminGuard)
  @Post()
  async createVehicle(@Body() data: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(data);
  }

  @UseGuards(IsAdminGuard)
  @Patch(":id")
  async updateVehicle(
    @Param("id") id: string,
    @Body() data: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(id, data);
  }


  @UseGuards(IsAdminGuard)
  @Delete(":id")
  async deleteVehicle(@Param("id") id: string) {
    return this.vehiclesService.deleteVehicle(id);
  }
}