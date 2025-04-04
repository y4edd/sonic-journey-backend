import { Injectable } from '@nestjs/common';
import { DeezerSongs, DeezerTrack } from './interfaces/song.interface';

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
    console.log('songData', songData);

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
    console.log('resSongData', resSongData);
    return resSongData;
  }
}
