import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../../../prisma/prisma";
import { User } from "../../../generated/prisma/client";
import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(data: RegisterDto) {
    this.assertJwtSecret();

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const { password, ...rest } = data;

    const user = await this.prismaService.user.create({
      data: {
        ...rest,
        password: await this.hashPassword(password),
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.createToken(user),
    };
  }

  async loginUser(data: LoginDto) {
    this.assertJwtSecret();

    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.createToken(user),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private assertJwtSecret(): void {
    if (!process.env.JWT_SECRET) {
      throw new UnauthorizedException("JWT_SECRET is not set");
    }
  }

  private createToken(user: User): string {
    this.assertJwtSecret();

    return this.jwtService.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
}