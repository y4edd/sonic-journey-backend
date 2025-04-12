import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/cookie-auth.guard';
import { HeaderAuthGuard } from './guards/header-auth.guard';

@Module({
  imports: [PrismaModule, JwtModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, HeaderAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
