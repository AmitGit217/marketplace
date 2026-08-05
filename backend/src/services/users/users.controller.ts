import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { UsersService } from "./users.service";
import { AuthGuard } from "../../guards/auth.guard";
import { UpdateUserDto } from "./dto";


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

  @Patch(":id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(":id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(":id/sales")
  getUserSales(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserSales(id);
  }
}