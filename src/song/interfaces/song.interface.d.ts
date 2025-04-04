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
