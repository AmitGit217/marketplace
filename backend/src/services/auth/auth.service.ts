import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma";
import { User } from "../../../generated/prisma/client";
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

    async registerUser(data: User) {
        const { password, ...rest} = data;
        const hashedPassword = this.hashPassword(password);
        return this.prismaService.user.create({
            data: {
                ...rest,
                password: hashedPassword,
            },
        });
       
    }

    async loginUser(email: string, password: string) {
        const user =await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = require("bcrypt").compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const { password: _password, ...userWithoutPassword } = user;

        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);
        return { user: userWithoutPassword, token };
    }

    private hashPassword(password: string): string {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        return hashedPassword;
    }
}

