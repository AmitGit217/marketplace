import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/auth/auth.module';
import { VehiclesModule } from './services/vehicles/vehicles.module';
import { SalesModule } from './services/sales/sales.module';
import { UsersModule } from './services/users/users.module';
import { DashboardModule } from './services/dashboard/dashboard.module';
import { ClientsModule } from './services/client/clients.module';

@Module({
  imports: [AuthModule, VehiclesModule, SalesModule, UsersModule, ClientsModule,DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
