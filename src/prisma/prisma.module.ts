import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  // これないと他モジュールでprismaServiceが使えない
  exports: [PrismaService],
})
export class PrismaModule {}
