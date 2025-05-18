import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ArtistAlbums, DeezerAlbum } from './interfaces/album.interface';
import { MyLogger } from 'src/logger/logger';

@Injectable()
export class AlbumService {
  constructor(private readonly logger: MyLogger) {}
  async getAlbumById(id: number) {
    this.logger.log(
      `AlbumService: Searching album in the database for ID: ${id}`,
    );
    try {
      const response = await fetch(`https://api.deezer.com/album/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch album');
      }

      const res = (await response.json()) as DeezerAlbum;
      if (!res.id) {
        return null;
      }

      const albumSongs = res.tracks.data.map((song) => ({
        id: song.id,
        title: song.title ?? 'title',
        duration: song.duration ?? '不明',
        preview: song.preview,
        cover_xl: song.album.cover_xl ?? '/images/defaultsong.png',
      }));
      this.logger.log('AlbumService: Found album');
      return {
        id: res.id,
        title: res.title ?? 'title',
        cover_xl: res.cover_xl ?? '/images/defaultsong.png',
        nb_tracks: res.nb_tracks ?? '不明',
        artist: {
          id: res.artist.id,
          name: res.artist.name ?? 'artist',
          picture_xl: res.artist.picture_xl ?? '/images/defaultsong.png',
        },
        albumSongs,
      };
    } catch (err) {
      this.logger.log(`error occured: ${err}`);
      throw new InternalServerErrorException(
        'アルバム情報の取得に失敗しました',
      );
    }
  }

  async getAlbumByArtistName(artistName: string, limit: number) {
    try {
      const response = await fetch(
        `https://api.deezer.com/search/album?q=${artistName}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const res = (await response.json()) as ArtistAlbums;
      this.logger.log(
        `AlbumService: Searching album in the database for NAME: ${artistName}`,
      );
      return res.data.map((data) => ({
        id: data.id,
        title: data.title,
        cover_xl: data.cover_xl,
        artist: {
          name: data.artist.name,
        },
      }));
    } catch (err) {
      this.logger.log(`error occured: ${err}`);
      throw new InternalServerErrorException(
        'アーティストのアルバム取得に失敗しました',
      );
    }
  }
}
