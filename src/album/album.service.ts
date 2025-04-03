import { Injectable } from '@nestjs/common';
import {
  ArtistAlbum,
  ArtistAlbums,
  DeezerAlbum,
} from './interfaces/album.interface';

@Injectable()
export class AlbumService {
  async getAlbumById(id: number) {
    const response = await fetch(`https://api.deezer.com/album/${id}`);
    const res = (await response.json()) as DeezerAlbum;
    // trackから楽曲たちを取り出し、必要なものだけにする
    const albumSongs = res.tracks.data.map((song) => {
      return {
        id: song.id,
        title: song.title ?? 'title',
        duration: song.duration ?? '不明',
        preview: song.preview,
        cover_xl: song.album.cover_xl ?? '/images/defaultsong.png',
      };
    });
    // レスポンスとして返却するためのデータを整理する
    const resultData = {
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
    return resultData;
  }

  async getAlbumByArtistName(artistName: string, limit: number) {
    try {
      const response = await fetch(
        `https://api.deezer.com/search/album?q=${artistName}&limit=${limit}`,
      );
      if (!response) {
        console.error('アーティストのアルバムが見つかりませんでした');
      }
      const res = (await response.json()) as ArtistAlbums;
      const resultData = res.data.map((data: ArtistAlbum) => {
        return {
          id: data.id,
          title: data.title,
          cover_xl: data.cover_xl,
          artist: {
            name: data.artist.name,
          },
        };
      });
      return resultData;
    } catch (error) {
      console.error(error);
    }
  }
}
