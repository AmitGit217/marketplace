import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto";
import { CurrentUser } from "../../decorators/CurrentUser";
import { AuthGuard } from "../../guards/auth.guard";


@UseGuards(AuthGuard)
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
  createSale(@Body() createSaleDto: CreateSaleDto, @CurrentUser() user: any) {
    return this.salesService.createSale(createSaleDto, user);
  }

  @Delete(":id")
  deleteSale(@Param("id", ParseIntPipe) id: number) {
    return this.salesService.deleteSale(id);
  }
}