import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/auth/auth.module';
import { VehiclesModule } from './services/vehicles/vehicles.module';
import { SalesModule } from './services/sales/sales.module';

@Module({
  imports: [AuthModule, VehiclesModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
