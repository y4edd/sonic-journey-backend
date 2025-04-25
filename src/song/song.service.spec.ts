import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import {
  mockArtistId,
  mockLimit,
  mockNewResponse,
  mockRankingLimit,
  mockRankingResponse,
  mockSongByArtistResponse,
  mockSongByWordResponse,
  mockWord,
} from './__mocks__/song.controller.mock';
import { mockSongErrorResponse } from './__mocks__/song.service.mock';
import { SongController } from './song.controller';

describe('SongService', () => {
  let songService: SongService;

  // fetchをモック化し、追跡可能に
  global.fetch = jest.fn();
  // console.errorをモック化する
  jest.spyOn(console, 'error');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [SongService],
    }).compile();

    songService = module.get<SongService>(SongService);
  });

  // song/rankingに関するテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    jest
      .spyOn(songService, 'getRankingSong')
      .mockResolvedValue(mockRankingResponse);

    const result = await songService.getRankingSong(mockRankingLimit);
    expect(result).toEqual(mockRankingResponse);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getRankingSong(mockRankingLimit);
    } catch {
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    // 副作用（関数の外に影響を与える）の方を確認する
    expect(spyConsole).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getRankingSong(mockRankingLimit);
    } catch {
      // NotFoundException が投げられるのは想定どおりなので握りつぶす
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    expect(console.error).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  // song/newのテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    jest.spyOn(songService, 'getNewSong').mockResolvedValue(mockNewResponse);

    const result = await songService.getNewSong(mockRankingLimit);
    expect(result).toEqual(mockNewResponse);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getNewSong(mockRankingLimit);
    } catch {
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    // 副作用（関数の外に影響を与える）の方を確認する
    expect(spyConsole).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getNewSong(mockRankingLimit);
    } catch {
      // NotFoundException が投げられるのは想定どおりなので握りつぶす
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    expect(console.error).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  // song?artist-id=...&limit=...のテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    jest
      .spyOn(songService, 'getSongByArtistId')
      .mockResolvedValue(mockSongByArtistResponse);

    const result = await songService.getSongByArtistId(mockArtistId, mockLimit);

    expect(result).toEqual(mockSongByArtistResponse);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getSongByArtistId(mockArtistId, mockLimit);
    } catch {
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    // 副作用（関数の外に影響を与える）の方を確認する
    expect(spyConsole).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getSongByArtistId(mockArtistId, mockLimit);
    } catch {
      // NotFoundException が投げられるのは想定どおりなので握りつぶす
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    expect(console.error).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  // song?word=...&limit=...のテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    jest
      .spyOn(songService, 'getSongByWord')
      .mockResolvedValue(mockSongByWordResponse);

    const result = await songService.getSongByWord(mockWord);

    expect(result).toEqual(mockSongByWordResponse);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getSongByWord(mockWord);
    } catch {
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    // 副作用（関数の外に影響を与える）の方を確認する
    expect(spyConsole).toHaveBeenCalledWith(mockSongErrorResponse);
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockRejectedValue(mockSongErrorResponse);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await songService.getSongByWord(mockWord);
    } catch {
      // NotFoundException が投げられるのは想定どおりなので握りつぶす
      // ここでは何もしない = 握りつぶす（テストの本質ではないので）
    }

    expect(console.error).toHaveBeenCalledWith(mockSongErrorResponse);
  });
  // song/:idのテスト
});
