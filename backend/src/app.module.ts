import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/auth/auth.module';
import { VehiclesModule } from './services/vehicles/vehicles.module';
import { SalesModule } from './services/sales/sales.module';
import { UsersModule } from './services/users/users.module';
import { DashboardModule } from './services/dashboard/dashboard.module';

@Module({
  imports: [AuthModule, VehiclesModule, SalesModule, UsersModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
