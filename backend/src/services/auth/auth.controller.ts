import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { User } from "../../../generated/prisma/client";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() userData: User) {
        return await this.authService.registerUser(userData);
    }

    @Post("login")
    async login(@Body() credentials: { email: string; password: string }) {
        return await this.authService.loginUser(credentials.email, credentials.password);
    }
}
