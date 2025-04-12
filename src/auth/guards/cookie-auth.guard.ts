import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestWithCookies } from '../interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

// NestJSはマルチプロトコル対応
// HTTP,WebSocket,gRPCなどある中でExecutionContext(実行コンテキスト)で
// 今のリクエストの種類を教えてくれる
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // このリクエストはHTTP通信だから、HTTPのリクエスト情報を取り出す
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const token = request.cookies?.access_token;

    if (!token) {
      return false;
    }

    try {
      // （秘密鍵で署名されているか）検証を行う
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_SECRET_KEY'),
      });

      // DBよりユーザー情報を取得
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('ユーザーが見つかりません');
      }

      // 検証に成功したらユーザー情報をrequestに乗せる
      request.user = user;
      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('トークンが無効です');
    }
  }
}
