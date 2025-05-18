// logger.module.ts
import { Global, Module } from '@nestjs/common';
import { MyLogger } from './logger';

// これで全てのモジュールで利用可能に
@Global()
@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
