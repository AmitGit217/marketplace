import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/auth/auth.module';
import { VehiclesModule } from './services/vehicles/vehicles.module';

@Module({
  imports: [AuthModule, VehiclesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
