import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../../prisma/prisma";
import { UpdateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

 async getUserById(id: number) {
  const user =
    await this.prismaService.user.findUnique({
      where: { id },
      include: {
        sales: {
          include: {
            vehicle: true,
            client: true,
          },
          orderBy: {
            saleDate: "desc",
          },
        },
      },
    });

  if (!user) {
    throw new NotFoundException(
      `User with id ${id} not found`
    );
  }

  return user;
}

  async updateUser(id: number, data: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      throw new BadRequestException();
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      throw new BadRequestException();
    }
  }

  async getUserSales(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user.sales;
  }
}