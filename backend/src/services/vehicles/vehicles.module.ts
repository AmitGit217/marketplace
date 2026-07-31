import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicels.service';

@Module({
  imports: [],
  providers: [VehiclesService, PrismaService],
  exports: [],
  controllers: [VehiclesController],
})
export class VehiclesModule {}