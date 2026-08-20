import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";

import { ClientsService } from "./clients.service";

import {
  CreateClientDto,
  UpdateClientDto,
} from "./dto";

@Controller("clients")
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  async getClients() {
    return this.clientsService.getClients();
  }

  @Get(":id")
  async getClientById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.clientsService.getClientById(id);
  }

  @Post()
  async createClient(
    @Body() data: CreateClientDto,
  ) {
    return this.clientsService.createClient(data);
  }

  @Patch(":id")
  async updateClient(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateClientDto,
  ) {
    return this.clientsService.updateClient(id, data);
  }

  @Delete(":id")
  async deleteClient(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.clientsService.deleteClient(id);
  }

  @Get(":id/sales")
  async getClientSales(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.clientsService.getClientSales(id);
  }
}