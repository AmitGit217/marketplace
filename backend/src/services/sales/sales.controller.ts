import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getSales() {
    return this.salesService.getSales();
  }

  @Get(":id")
  getSaleById(@Param("id", ParseIntPipe) id: number) {
    return this.salesService.getSaleById(id);
  }

  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.createSale(createSaleDto);
  }

  @Delete(":id")
  deleteSale(@Param("id", ParseIntPipe) id: number) {
    return this.salesService.deleteSale(id);
  }
}