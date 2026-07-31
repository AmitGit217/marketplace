import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../../prisma/prisma";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto";

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehicles() {
    return this.prisma.vehicle.findMany();
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    return vehicle;
  }

  async createVehicle(data: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Vehicle already exists");
      }

      throw new InternalServerErrorException("Failed to create vehicle");
    }
  }

  async updateVehicle(id: string, data: UpdateVehicleDto) {
    await this.getVehicleById(id);

    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to update vehicle");
    }
  }

  async deleteVehicle(id: string) {
    await this.getVehicleById(id);

    try {
      return await this.prisma.vehicle.delete({
        where: { id },
      });
    } catch {
      throw new InternalServerErrorException("Failed to delete vehicle");
    }
  }
}