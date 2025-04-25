import { DeezerAlbumInfo } from 'src/album/interfaces/album.interface';
import { DeezerArtist } from 'src/artist/interfaces/artist.interface';

export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: DeezerArtist;
  album: DeezerAlbumInfo;
  type: string;
}

export interface DeezerSongs {
  data: DeezerTrack[];
}

// deezerにて楽曲情報を取得した際の型
export interface DeezerNewRelease {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  release_date: string;
  tracklist: string;
  artist: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerNewSongs {
  data: DeezerNewRelease[];
}

export interface SongsDTO {
  songIds: number[];
}
