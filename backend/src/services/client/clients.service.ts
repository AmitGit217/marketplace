import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../../prisma/prisma";
import {
  CreateClientDto,
  UpdateClientDto,
} from "./dto";

@Injectable()
export class ClientsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async getClients() {
    return this.prismaService.client.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getClientById(id: number) {
    const client =
      await this.prismaService.client.findUnique({
        where: { id },
        include: {
          sales: {
            include: {
              vehicle: true,
            },
            orderBy: {
              saleDate: "desc",
            },
          },
        },
      });

    if (!client) {
      throw new NotFoundException(
        `Client with id ${id} not found`,
      );
    }

    return client;
  }

  async createClient(data: CreateClientDto) {
    try {
      return await this.prismaService.client.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateClient(
    id: number,
    data: UpdateClientDto,
  ) {
    try {
      return await this.prismaService.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(
          `Client with id ${id} not found`,
        );
      }

      throw new BadRequestException();
    }
  }

  async deleteClient(id: number) {
    try {
      return await this.prismaService.client.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(
          `Client with id ${id} not found`,
        );
      }

      throw new BadRequestException();
    }
  }

  async getClientSales(id: number) {
    const client =
      await this.prismaService.client.findUnique({
        where: { id },
        include: {
          sales: true,
        },
      });

    if (!client) {
      throw new NotFoundException(
        `Client with id ${id} not found`,
      );
    }

    return client.sales;
  }
}