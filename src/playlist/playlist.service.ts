import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  RequestWithAuthorizationHeader,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DiffPlaylistsDTO,
  PlaylistDTO,
  PutPlaylistDTO,
} from './dto/playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}
  async getPlaylist(request: RequestWithAuthorizationHeader) {
    const user = request.user;

    if (!user) {
      return { message: 'プレイリストの取得にはログインが必要です' };
    }

    const playlist = await this.prisma.playlist.findMany({
      where: {
        user_id: user,
      },
    });
    return playlist;
  }

  async getPlaylistCSR(request: RequestWithCookies) {
    const userId = request.user?.id;

    if (!userId) {
      return { message: 'プレイリストの取得にはログインが必要です' };
    }

    const playlist = await this.prisma.playlist.findMany({
      where: {
        user_id: userId,
      },
    });

    return playlist;
  }

  async postPlaylist(request: RequestWithCookies, dto: PlaylistDTO) {
    const user = request.user?.id;
    const name = dto.name;
    if (!user) {
      return { message: '再生履歴の保存にはログインが必要です' };
    }

    const sameTitleCheck = await this.prisma.playlist.findFirst({
      where: {
        user_id: user,
        name: name,
      },
    });

    if (sameTitleCheck) {
      throw new ForbiddenException('プレイリストの名前が重複しています');
    }

    await this.prisma.playlist.create({
      data: {
        user_id: user,
        name: name,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'ok',
    };
  }

  async getSong(request: RequestWithAuthorizationHeader, id: number) {
    const user = request.user;

    if (!user) {
      return { message: '再生履歴の保存にはログインが必要です' };
    }

    const playlistInfo = await this.prisma.playlist_Song.findMany({
      where: {
        playlist_id: id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    // 楽曲IDを返す
    const songIds = playlistInfo.map((id) => {
      const numberId = Number(id.api_song_id);
      return numberId;
    });
    return songIds;
  }

  async putPlaylistName(
    request: RequestWithCookies,
    id: number,
    dto: PutPlaylistDTO,
  ) {
    const user = request.user?.id;

    if (!user) {
      return { message: '再生履歴の操作にはログインが必要です' };
    }

    await this.prisma.playlist.update({
      where: {
        id: id,
      },
      data: {
        user_id: user,
        name: dto.name,
        updatedAt: new Date(),
      },
    });

    return {
      mesage: 'ok',
    };
  }

  async deletePlaylist(request: RequestWithCookies, id: number) {
    const user = request.user?.id;

    if (!user) {
      return { message: '再生履歴の操作にはログインが必要です' };
    }

    await this.prisma.playlist.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'ok',
    };
  }

  async postSongPlaylist(
    request: RequestWithCookies,
    id: number,
    dto: DiffPlaylistsDTO,
  ) {
    const user = request.user?.id;
    if (!user) {
      return { message: '再生履歴の保存にはログインが必要です' };
    }

    const songId = BigInt(id);

    for (let i = 0; i < dto.playlists.length; i++) {
      if (dto.playlists[i].musicFlag) {
        await this.prisma.playlist_Song.create({
          data: {
            playlist_id: dto.playlists[i].playlistId,
            api_song_id: songId,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }
    }
    return {
      message: 'ok',
    };
  }

  async deleteSongPlaylist(
    request: RequestWithCookies,
    id: number,
    dto: DiffPlaylistsDTO,
  ) {
    const user = request.user?.id;
    if (!user) {
      return { message: '再生履歴の操作にはログインが必要です' };
    }

    const songId = BigInt(id);

    for (const ele of dto.playlists) {
      if (ele.musicFlag) {
        const submitCheck = await this.prisma.playlist_Song.findFirst({
          where: {
            playlist_id: ele.playlistId,
            api_song_id: songId,
          },
        });

        if (submitCheck) {
          await this.prisma.playlist_Song.delete({
            where: {
              id: submitCheck.id,
            },
          });
        }
      }
    }
    return {
      message: 'ok',
    };
  }
}
