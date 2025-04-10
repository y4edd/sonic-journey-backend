import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  // Prisma、jwt、configのServiceが必要
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  // ログイン時、JWTを生成する関数
  async generateJwt(userId: string) {
    const payload = {
      sub: userId,
    };
    const secret: string | undefined = this.config.get('JWT_SECRET_KEY');
    if (!secret) {
      throw new Error('JWT_SECRET が設定されていません');
    }
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async login(dto: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'メールアドレスかパスワードが間違っています',
      );
    }
    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new ForbiddenException(
        'メールアドレスかパスワードが間違っています',
      );
    }
    return this.generateJwt(user.id);
  }
}
