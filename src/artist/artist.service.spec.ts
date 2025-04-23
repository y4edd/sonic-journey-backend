import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import {
  mockArtist,
  mockArtistByWord,
  mockLimit,
  mockWord,
} from './__mocks__/artist.controller.mock';
import {
  mockArtistResponseByWord,
  mockErrorResponse,
} from './__mocks__/artist.service.mock';

describe('ArtistService', () => {
  let artistService: ArtistService;

  beforeEach(async () => {
    // fetchをモック化しておく
    global.fetch = jest.fn();
    // console.errorの呼び出しを監視できるように
    jest.spyOn(console, 'error');
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistService],
    }).compile();

    // 「module」というDIコンテナのような存在からArtistServiceのインスタンスを取り戻す
    artistService = module.get<ArtistService>(ArtistService);
  });

  // artist/:idのテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => mockArtist,
    });

    const result = await artistService.getArtistById('1');

    expect(result).toEqual(mockArtist);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (fetch as jest.Mock).mockRejectedValue(mockErrorResponse);

    await artistService.getArtistById('1');
    expect(console.error).toHaveBeenCalledWith(mockErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (fetch as jest.Mock).mockRejectedValue(null);

    const result = await artistService.getArtistById('1');
    expect(result).toEqual(null);
  });

  // /artist/?word=...&genre=...&limit=...のテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => mockArtistResponseByWord,
    });

    const result = await artistService.getArtistByWord(mockWord, mockLimit);

    expect(result).toEqual([mockArtistByWord]);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (fetch as jest.Mock).mockRejectedValue(mockErrorResponse);

    await artistService.getArtistByWord(mockWord, mockLimit);
    expect(console.error).toHaveBeenCalledWith(mockErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (fetch as jest.Mock).mockRejectedValue(mockErrorResponse);

    const result = await artistService.getArtistByWord(mockWord, mockLimit);
    expect(result).toEqual(null);
  });
});
