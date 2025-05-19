import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLogger } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: MyLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 型注釈を追加
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    // 処理時間の計測開始
    const start = Date.now();
    this.logger.debug(
      `[Request] ${method} ${url} - ${controllerName}.${handlerName} 開始`,
    );

    // ✅ Response が確実に送信されたタイミングで処理
    response.on('finish', () => {
      const end = Date.now();
      const responseTime = end - start;

      this.logger.logExecutionTime(`${controllerName}.${handlerName}`, start);
      this.logger.debug(`[Response] ${method} ${url} - ${responseTime}ms`);

      // ログの詳細情報
      this.logger.log({
        method,
        url,
        statusCode: response.statusCode,
        responseTime: `${responseTime}ms`,
      });
    });

    return next.handle();
  }
}
