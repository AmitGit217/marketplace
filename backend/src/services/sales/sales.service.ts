import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma";
import { CreateSaleDto } from "./dto";
import { Prisma } from "../../../generated/prisma/client";

@Injectable()
export class SalesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSales() {
    return this.prismaService.sale.findMany();
  }

  async getSaleById(id: number) {
    const sale = await this.prismaService.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }

    return sale;
  }

  async createSale(data: CreateSaleDto) {
    try {
      return await this.prismaService.sale.create({
        data,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async deleteSale(id: number) {
    try {
      return await this.prismaService.sale.delete({
        where: { id },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`Sale with id ${id} not found`);
      }

      throw error;
    }
  }
}