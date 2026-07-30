import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";

import type { User } from "../../../generated/prisma/client";
import { AuthGuard } from "../../guards/auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { CurrentUser } from "../../decorators/CurrentUser";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() userData: RegisterDto) {
    return this.authService.registerUser(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() credentials: LoginDto) {
    return this.authService.loginUser(credentials);
  }

    @Get("me")
    @UseGuards(AuthGuard)
    getProfile(@CurrentUser() user: User) {
    return user;
    }
}