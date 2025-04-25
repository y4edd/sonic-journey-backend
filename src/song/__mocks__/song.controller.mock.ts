import { GetSongsDto } from '../dto/song.dto';

export const mockRankingResponse = [
  {
    id: 1,
    title: 'test',
    artist: {
      id: 1,
      name: 'test',
    },
    album: {
      id: 1,
      title: 'test',
      cover_xl: '/images/defaultsong.png',
    },
  },
];

export const mockRankingLimit = 5;

export const mockNewResponse = [
  {
    id: 1,
    title: 'album',
    cover_xl: '/images/defaultsong.png',
    release_date: 'release_date',
    artist: {
      id: 1,
      name: 'artist',
    },
  },
];

export const mockSongByArtistResponse = [
  {
    id: 1,
    title: 'title',
    preview: 'test',
    duration: 1,
    artist: {
      id: 1,
      name: 'artist',
      image: '/images/defaultsong.png',
    },
    album: {
      id: 1,
      title: 'album',
      cover_xl: '/images/defaultsong.png',
    },
  },
];

export const mockArtistId = '1';

export const mockWord = 'test';

export const mockLimit = 5;

export const mockArtistQuery: GetSongsDto = {
  artistId: mockArtistId,
  limit: mockLimit,
};

export const mockWordQuery: GetSongsDto = {
  word: mockWord,
  limit: mockLimit,
};

export const mockSongByWordResponse = [
  {
    id: 1,
    title: 'title',
    duration: 1,
    preview: 'test',
    artist: {
      id: 1,
      name: 'artist',
      picture_big: '/images/defaultsong.png',
    },
    cover: '/images/defaultsong.png',
  },
];

// song/:idはパスパラメータなので返却は一意のオブジェクト
export const mockSongBySongIdResponse = {
  id: 1,
  title: 'title',
  cover_xl: '/images/defaultsong.png',
  preview: 'test',
  artist: {
    id: 1,
    name: 'artist',
    picture_xl: '/images/defaultsong.png',
  },
  album: {
    id: 1,
    title: 'album',
    cover_xl: '/images/defaultsong.png',
  },
};
