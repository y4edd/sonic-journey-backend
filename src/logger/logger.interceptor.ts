import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLogger } from './logger';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: MyLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 型注釈を追加
    const request: Request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const ip = request.ip;

    this.logger.log(`[Request] ${method} ${url} from ${ip}`);
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        const elapsedTime = end - start;
        this.logger.log(`[Response] ${method} ${url} - ${elapsedTime}ms`);
      }),
    );
  }
}
