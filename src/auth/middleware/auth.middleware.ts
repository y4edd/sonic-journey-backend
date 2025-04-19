import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload, RequestWithCookies } from '../interfaces/auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: RequestWithCookies, res: Response, next: NextFunction) {
    try {
      // cookieよりJWTトークンを取得
      const cookieToken = req.cookies?.access_token ?? null;
      // Authoriationヘッダーよりトークン取得
      const headerTokenRaw = req.headers['authorization'] as string | undefined;
      const headerToken = headerTokenRaw?.split('=')[1] ?? null;

      const token: string | null = cookieToken || headerToken;
      // トークンがなければスルー（非認証扱い）
      if (!token) return next();

      // JWT検証
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_SECRET_KEY'),
      });

      if (!payload?.sub) {
        throw new UnauthorizedException('JWTのペイロード形式が不正です');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true },
      });

      if (!user) throw new UnauthorizedException('ユーザーが存在しません');
      req.user = user;

      return next();
    } catch (err) {
      console.error('[AuthMiddleware] トークン検証失敗', err);
      throw new UnauthorizedException('無効なトークンです');
    }
  }
}
