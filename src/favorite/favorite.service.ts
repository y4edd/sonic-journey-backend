import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  AuthrizationPayload,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongsDTO } from 'src/song/dto/song.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getSong(request: Request) {
    // Authorizationヘッダーを使ったので、ここから取得
    const authHeader = request.headers.authorization;

    // 解析し、userIdを取得
    const token = authHeader?.split('=')[1];
    if (!token) {
      throw new ForbiddenException('トークンが存在しません');
    }
    const payload: AuthrizationPayload = await this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET_KEY'),
    });

    if (!payload) {
      throw new ForbiddenException('秘密鍵は存在しません');
    }

    const userId = payload.sub;

    const favSongs = await this.prisma.favorite_Song.findMany({
      where: {
        user_id: userId,
      },
    });

    // BigIntをstringに変換
    const formatted = favSongs.map((song) => ({
      ...song,
      api_song_id: song.api_song_id.toString(),
    }));

    return formatted;
  }

  async deleteSong(request: RequestWithCookies, dto: SongsDTO) {
    // Guardにより付与されたユーザーIDを取得
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('ユーザーが存在しません');
    }

    await this.prisma.favorite_Song.deleteMany({
      where: {
        user_id: userId,
        api_song_id: {
          in: dto.songIds,
        },
      },
    });

    return {
      message: 'ok',
    };
  }

  async postSong(request: RequestWithCookies, id: number) {
    // Guardにより付与されたユーザーIDを取得
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('ユーザーが存在しません');
    }

    // すでにお気に入りに登録されていないかか確認する
    const isFav = await this.prisma.favorite_Song.findFirst({
      where: {
        user_id: userId,
        api_song_id: id,
      },
    });

    if (isFav) {
      throw new ForbiddenException('すでにお気に入り登録済みです');
    }

    await this.prisma.favorite_Song.create({
      data: {
        user_id: userId,
        api_song_id: BigInt(id),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      message: 'ok',
    };
  }
}
