import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeezerNewRelease,
  DeezerNewSongs,
  DeezerSongs,
  DeezerTrack,
} from './interfaces/song.interface';

@Injectable()
export class SongService {
  async getSongByArtistId(artistId: string, limit: number) {
    const response = await fetch(
      `https://api.deezer.com/artist/${artistId}/top?limit=${limit}`,
    );

    if (!response) {
      console.error('アーティストの人気楽曲は見つかりませんでした');
    }
    const res = (await response.json()) as DeezerSongs;
    const songs = res.data.map((data: DeezerTrack) => {
      return {
        id: data.id,
        title: data.title ?? 'title',
        preview: data.preview,
        duration: data.duration ?? 'duration',
        artist: {
          id: data.artist.id,
          name: data.artist.name ?? 'artist',
          image: data.artist.picture_big ?? '/images/defaultsong.png',
        },
        album: {
          id: data.album.id,
          title: data.album.title ?? 'album',
          cover_xl: data.album.cover_big ?? '/images/defaultsong.png',
        },
      };
    });
    return songs;
  }

  async getSongByWord(word: string) {
    const response = await fetch(`https://api.deezer.com/search?q=${word}`);

    if (!response) {
      console.error('このキーワードに該当する楽曲は存在しませんでした');
    }
    const res = (await response.json()) as DeezerSongs;
    const songs = res.data.map((data: DeezerTrack) => {
      return {
        id: data.id,
        title: data.title ?? 'title',
        duration: data.duration ?? 'duration',
        preview: data.preview,
        artist: {
          id: data.artist.id,
          name: data.artist.name ?? 'artist',
          picture_big: data.artist.picture_big ?? '/images/defaultsong.png',
        },
        cover: data.album.cover_big ?? '/images/defaultsong.png',
      };
    });
    return songs;
  }

  async getSongBySongId(id: string) {
    const response = await fetch(`https://api.deezer.com/track/${id}`);

    if (!response) {
      console.error('楽曲情報は見つかりませんでした');
    }

    const songData = (await response.json()) as DeezerTrack;

    const resSongData = {
      id: songData.id,
      title: songData.title ?? 'title',
      cover_xl: songData.album.cover_xl ?? '/images/defaultsong.png',
      preview: songData.preview,
      artist: {
        id: songData.artist.id,
        name: songData.artist.name ?? 'artist',
        picture_xl: songData.artist.picture_xl ?? '/images/defaultsong.png',
      },
      album: {
        id: songData.album.id,
        title: songData.album.title ?? 'album',
        cover_xl: songData.album.cover_xl ?? '/images/defaultsong.png',
      },
    };
    return resSongData;
  }

  async getRankingSong(limit: number) {
    try {
      const response = await fetch(
        `https://api.deezer.com/chart/0/tracks?limit=${limit}`,
      );
      if (!response.ok) {
        console.error('検索結果なし');
      }
      const res = (await response.json()) as DeezerSongs;
      const resultData = res.data.map((data: DeezerTrack) => {
        return {
          id: data.id,
          title: data.title ?? 'title',
          artist: {
            id: data.artist.id,
            name: data.artist.name ?? 'artist',
          },
          album: {
            id: data.album.id,
            title: data.album.title ?? 'album',
            cover_xl: data.album.cover_xl ?? '/images/defaultsong.png',
          },
        };
      });
      return resultData;
    } catch (err) {
      // これは検索結果なしorDeezerからのエラーが全て検索結果なしに集約される
      console.error(err);
      throw new NotFoundException('検索結果なし');
    }
  }

  async getNewSong(limit: number) {
    try {
      const response = await fetch(
        `https://api.deezer.com/editorial/16/releases?limit=${limit}`,
      );
      if (!response) {
        console.error('新着楽曲が見つかりませんでした');
      }
      const res = (await response.json()) as DeezerNewSongs;
      const resultData = res.data.map((data: DeezerNewRelease) => {
        return {
          id: data.id,
          title: data.title ?? 'album',
          cover_xl: data.cover_xl ?? '/images/defaultsong.png',
          release_date: data.release_date ?? 'release_date',
          artist: {
            id: data.artist.id,
            name: data.artist.name ?? 'artist',
          },
        };
      });
      return resultData;
    } catch (err) {
      console.error(err);
      throw new NotFoundException('新曲の取得に失敗');
    }
  }
}
