import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { AuthGuard } from "../../guards/auth.guard";
import { AdminRoleGuard } from "../../guards/isAdmin.guard";
import { CurrentUser } from "../../decorators/CurrentUser";
import { CreateUserDto, UpdateUserDto } from "./dto";

@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(":id")
  getUserById(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(
    @Body() data: CreateUserDto,
    @CurrentUser() actor: { role?: string },
  ) {
    return this.usersService.createUser(data, actor?.role);
  }

  @Patch(":id")
  @UseGuards(AdminRoleGuard)
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(":id")
  @UseGuards(AdminRoleGuard)
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(":id/sales")
  getUserSales(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserSales(id);
  }
}