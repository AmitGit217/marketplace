import { Module } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { SalesController } from "./sales.controller";
import { PrismaService } from "../../../prisma/prisma";

@Module({
  imports: [],
  controllers: [SalesController],
  providers: [SalesService, PrismaService],
})
export class SalesModule {}