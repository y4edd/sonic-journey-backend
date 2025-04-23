import { Test } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import {
  mockArtist,
  mockArtistByWord,
  mockArtistId,
  mockLimit,
  mockWord,
} from './__mocks__/artist.controller.mock';

describe('ArtistController', () => {
  let artistController: ArtistController;
  let artistService: ArtistService;

  // テスト用のモジュールとインスタンスを作成
  // （ここではArtistServiceをモック化し、外部依存を排除）
  // getArtistById、getArtistByWord、getArtistByGenreに対してモックの返り値を定義できるようにしておく
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        {
          provide: ArtistService,
          useValue: {
            getArtistById: jest.fn(),
            getArtistByWord: jest.fn(),
            getArtistByGenre: jest.fn(),
          },
        },
      ],
    }).compile();
    artistService = moduleRef.get(ArtistService);
    artistController = moduleRef.get(ArtistController);
  });

  // artist/:idのテスト
  test('サービスが呼び出されたこと', async () => {
    // getArtistByIdをモック化し、mockArtistを返すように設定
    const mockedFn = (
      artistService.getArtistById as jest.Mock
    ).mockResolvedValue(mockArtist);

    // controllerのgetArtistByIdを実行
    await artistController.getArtist(mockArtistId);

    // getArtistByIdが引数(mockId)を元に呼び出されたことを確認
    expect(mockedFn).toHaveBeenCalledWith(mockArtistId);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    // getArtistByIdをモック化し、mockArtistを返すように設定
    (artistService.getArtistById as jest.Mock).mockResolvedValue(mockArtist);

    // サービスの戻り値を変数resultに格納
    const result = await artistController.getArtist(mockArtistId);

    // サービスの戻り値がそのまま返っていることを確認
    expect(result).toEqual(mockArtist);
  });

  // /artist/?word=...&genre=...&limit=...のテスト
  test('サービスが呼び出されたこと', async () => {
    const mockedFn = (
      artistService.getArtistByWord as jest.Mock
    ).mockResolvedValue(mockArtistByWord);

    // serviceクラス内のメソッドを呼び出す
    await artistService.getArtistByWord(mockWord, mockLimit);

    // mockedFnが引数(mockWord, mockLimit)で呼び出されたことを確認
    expect(mockedFn).toHaveBeenCalledWith(mockWord, mockLimit);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    // getArtistByIdをモック化し、mockArtistを返すように設定
    (artistService.getArtistByWord as jest.Mock).mockResolvedValue(
      mockArtistByWord,
    );

    // サービスの戻り値を変数resultに格納
    const result = await artistController.getArtistByQuery(
      mockWord,
      0,
      mockLimit,
    );

    // サービスの戻り値がそのまま返っていることを確認
    expect(result).toEqual(mockArtistByWord);
  });
});
