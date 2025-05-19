import { Injectable, Logger } from '@nestjs/common';

// NestJSのLoggerを拡張して、debugレベルのログに処理時間を追加する
@Injectable()
export class MyLogger extends Logger {
  logExecutionTime(context: string, startTime: number) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    this.debug(`[${context}] Execution time: ${duration}ms`);
  }
}
