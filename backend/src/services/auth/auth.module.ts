import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma';

@Module({
  imports: [ 
      JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '60s' },
    }),],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}