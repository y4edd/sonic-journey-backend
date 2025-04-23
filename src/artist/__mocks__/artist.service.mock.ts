import { mockArtist, mockArtistByWord } from './artist.controller.mock';

export const mockArtistFromDeezer = {
  data: [mockArtist],
};

// エラーオブジェクトをモック化する
export const mockErrorResponse = new Error('通信エラー');

export const mockArtistResponseByWord = {
  data: [mockArtistByWord],
};
