import { Module } from '@nestjs/common';
import { PickController } from './pick.controller';
import { PickService } from './pick.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PickController],
  providers: [PickService],
})
export class PickModule {}
