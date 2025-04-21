import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HistoryDTO } from './dto/history.dto';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}
  async postHistory(request: RequestWithCookies, dto: HistoryDTO) {
    const songId = dto.songId;

    const userId = request.user?.id;
    if (!userId) {
      return { message: '再生履歴の保存にはログインが必要です' };
    }

    // 既存のユーザーと楽曲の履歴を削除（重複防止）
    await this.prisma.history.deleteMany({
      where: {
        user_id: userId,
        api_song_id: songId,
      },
    });

    // Prismaを使用してHistoryテーブルにデータを保存
    await this.prisma.history.create({
      data: {
        user_id: userId,
        api_song_id: songId,
        updatedAt: new Date(),
      },
    });

    // ユーザーの履歴を最新順に取得し、10件を超える古い履歴を取得
    const historiesToDelete = await this.prisma.history.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 10,
      select: {
        id: true,
      },
    });

    // 10件を超えたユーザーの履歴を削除
    if (historiesToDelete.length > 0) {
      const idsDelete = historiesToDelete.map((history) => history.id);
      await this.prisma.history.deleteMany({
        where: {
          id: { in: idsDelete },
        },
      });
    }

    return {
      message: 'ok',
    };
  }

  async getHistory(request: RequestWithCookies, limit: number) {
    if (!request.user) {
      throw new UnauthorizedException('ユーザー情報が存在しません');
    }

    const user = request.user?.id;
    if (!user) {
      throw new UnauthorizedException('ログインしてください');
    }

    const playHistoryIds = await this.prisma.history.findMany({
      where: {
        user_id: user,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        api_song_id: true,
      },
      take: limit,
    });
    // 楽曲IDを返す
    const songIds = playHistoryIds.map((id) => {
      const numberId = Number(id.api_song_id);
      return numberId;
    });
    return songIds;
  }

  async deleteHistory(request: RequestWithCookies) {
    const user = request.user?.id;
    if (!user) {
      return { message: '再生履歴の取得にはログインが必要です' };
    }

    await this.prisma.history.deleteMany({
      where: {
        user_id: user,
      },
    });

    return {
      message: 'ok',
    };
  }
}
