import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../../prisma/prisma";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

   async createUser(data: CreateUserDto) {
    try {
      const {password, ...userData} = data;
      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: await this.hashPassword(password),
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "A user with this email already exists",
        );
      }

      throw new BadRequestException();
    }
  }

  private async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, 10);
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
      const { password, ...userData } = data;
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