import { Test, TestingModule } from '@nestjs/testing';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import {
  mockArtistId,
  mockArtistQuery,
  mockLimit,
  mockNewResponse,
  mockRankingLimit,
  mockRankingResponse,
  mockSongByArtistResponse,
  mockSongBySongIdResponse,
  mockSongByWordResponse,
  mockWord,
  mockWordQuery,
} from './__mocks__/song.controller.mock';

describe('SongController', () => {
  let songController: SongController;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [
        {
          provide: SongService,
          useValue: {
            getSongByArtistId: jest.fn(),
            getSongByWord: jest.fn(),
            getSongBySongId: jest.fn(),
            getRankingSong: jest.fn(),
            getNewSong: jest.fn(),
          },
        },
      ],
    }).compile();

    songController = module.get<SongController>(SongController);
    songService = module.get<SongService>(SongService);
  });

  // song/rankingに関するテスト
  test('songService の get系関数が呼ばれること', async () => {
    const mockedFn = (
      songService.getRankingSong as jest.Mock
    ).mockResolvedValue(mockRankingResponse);

    await songController.getRankingSong(mockRankingLimit);

    expect(mockedFn).toHaveBeenCalledWith(mockRankingLimit);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (songService.getRankingSong as jest.Mock).mockResolvedValue(
      mockRankingResponse,
    );

    const result = await songController.getRankingSong(mockRankingLimit);

    expect(result).toEqual(mockRankingResponse);
  });

  // song/newのテスト
  test('songService の get系関数が呼ばれること', async () => {
    const mockedFn = (songService.getNewSong as jest.Mock).mockResolvedValue(
      mockNewResponse,
    );

    await songController.getNewSong(mockRankingLimit);

    expect(mockedFn).toHaveBeenCalledWith(mockRankingLimit);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (songService.getNewSong as jest.Mock).mockResolvedValue(mockNewResponse);

    const result = await songController.getNewSong(mockRankingLimit);

    expect(result).toEqual(mockNewResponse);
  });

  // song?artist-id=...&limit=...のテスト
  test('songService の get系関数が呼ばれること', async () => {
    const mockedFn = (
      songService.getSongByArtistId as jest.Mock
    ).mockResolvedValue(mockSongByArtistResponse);

    await songController.getSongByQuery(mockArtistQuery);

    expect(mockedFn).toHaveBeenCalledWith(mockArtistId, mockLimit);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (songService.getSongByArtistId as jest.Mock).mockResolvedValue(
      mockSongByArtistResponse,
    );

    const result = await songController.getSongByQuery(mockArtistQuery);

    expect(result).toEqual(mockSongByArtistResponse);
  });

  // song?word=...&limit=...のテスト
  test('songService の get系関数が呼ばれること', async () => {
    const mockedFn = (songService.getSongByWord as jest.Mock).mockResolvedValue(
      mockSongByWordResponse,
    );

    await songController.getSongByQuery(mockWordQuery);

    expect(mockedFn).toHaveBeenCalledWith(mockWord);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (songService.getSongByWord as jest.Mock).mockResolvedValue(
      mockSongByWordResponse,
    );

    const result = await songController.getSongByQuery(mockWordQuery);

    expect(result).toEqual(mockSongByWordResponse);
  });

  // song/:idのテスト
  test('songService の get系関数が呼ばれること', async () => {
    const mockedFn = jest
      .spyOn(songService, 'getSongBySongId')
      .mockResolvedValue(mockSongBySongIdResponse);

    await songController.getSongById(mockArtistId);

    expect(mockedFn).toHaveBeenCalledWith(mockArtistId);
  });
});
