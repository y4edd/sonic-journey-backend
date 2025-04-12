import { ForbiddenException, Injectable } from '@nestjs/common';
import { ArtistsDTO } from 'src/artist/dto/artist.dto';
import {
  RequestWithAuthorizationHeader,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongsDTO } from 'src/song/dto/song.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSong(request: RequestWithAuthorizationHeader) {
    const userId = request.user;

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

  async getArtist(request: RequestWithAuthorizationHeader) {
    // Guardにより付与されたユーザーIDを取得
    const userId = request.user;
    if (!userId) {
      throw new ForbiddenException('ユーザーが存在しません');
    }

    const favArtists = await this.prisma.favorite_Artist.findMany({
      where: {
        user_id: userId,
      },
    });

    // BigIntをstringに変換
    const formatted = favArtists.map((artist) => ({
      ...artist,
      api_artist_id: artist.api_artist_id.toString(),
    }));

    return formatted;
  }

  async deleteArtist(request: RequestWithCookies, dto: ArtistsDTO) {
    // Guardにより付与されたユーザーIDを取得
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('ユーザーが存在しません');
    }

    await this.prisma.favorite_Artist.deleteMany({
      where: {
        user_id: userId,
        api_artist_id: {
          in: dto.artistIds,
        },
      },
    });

    return {
      message: 'ok',
    };
  }

  async postArtist(request: RequestWithCookies, id: number) {
    // Guardにより付与されたユーザーIDを取得
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('ユーザーが存在しません');
    }

    // すでにお気に入りに登録されていないかか確認する
    const isFav = await this.prisma.favorite_Artist.findFirst({
      where: {
        user_id: userId,
        api_artist_id: id,
      },
    });

    if (isFav) {
      throw new ForbiddenException('すでにお気に入り登録済みです');
    }

    await this.prisma.favorite_Artist.create({
      data: {
        user_id: userId,
        api_artist_id: BigInt(id),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      message: 'ok',
    };
  }
}
