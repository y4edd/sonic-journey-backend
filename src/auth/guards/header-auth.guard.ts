import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthorizationPayload } from '../interfaces/auth.interface';

// header-auth.guard.ts
// AuthorizationヘッダーからJWTを解析し、userIdを取得します
@Injectable()
export class HeaderAuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    const token = authHeader?.split('=')[1];
    if (!token) return false;

    try {
      const payload: AuthorizationPayload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET_KEY'),
      });

      if (!payload) {
        throw new ForbiddenException('秘密鍵は存在しません');
      }

      const userId = payload.sub;
      req.user = userId;
      return true;
    } catch {
      throw new ForbiddenException('不正なトークンです');
    }
  }
}
