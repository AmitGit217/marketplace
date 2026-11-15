import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../../prisma/prisma";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany({
      omit: { password: true },
    });
  }

   async createUser(data: CreateUserDto, actorRole?: string) {
    try {
      const { password, role, ...userData } = data;

      if (role === "admin" && actorRole !== "admin") {
        throw new ForbiddenException(
          "Only an admin can assign the admin role",
        );
      }

      return await this.prismaService.user.create({
        data: {
          ...userData,
          ...(role ? { role } : {}),
          password: await this.hashPassword(password),
        },
        omit: { password: true },
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

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
      omit: { password: true },
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
        data: {
          ...userData,
          ...(password
            ? { password: await this.hashPassword(password) }
            : {}),
        },
        omit: { password: true },
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
        omit: { password: true },
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