import { Test } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import {
  mockAlbum,
  mockArtist,
  mockId,
  mockLimit,
} from './__mocks__/album.controller.mock';

describe('AlbumController', () => {
  //スコープの関係上、一度ここで宣言する必要あり
  let albumController: AlbumController;
  let albumService: AlbumService;

  // 各テストケースの前にテスト用モジュールとインスタンスを作成
  // AlbumService をモック化し、外部依存を排除
  // getAlbumById(), getAlbumByArtistName() に対してモックの返り値を定義できるようにする
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        {
          provide: AlbumService,
          useValue: {
            getAlbumById: jest.fn(),
            getAlbumByArtistName: jest.fn(),
          },
        },
      ],
    }).compile();

    // モックした AlbumService インスタンスを取得
    albumService = moduleRef.get(AlbumService);
    albumController = moduleRef.get(AlbumController);
  });

  // album/:id に関するテスト
  test('サービスが呼び出されたこと', async () => {
    // getAlbumById をモック化し、mockAlbum を返すように設定
    const mockedFn = (albumService.getAlbumById as jest.Mock).mockResolvedValue(
      mockAlbum,
    );

    // Controller の getAlbum を実行（内部で Service の関数を呼び出す）
    await albumController.getAlbum(mockId);

    // getAlbumById が mockId を引数に呼び出されたことを検証
    expect(mockedFn).toHaveBeenCalledWith(mockId);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (albumService.getAlbumById as jest.Mock).mockResolvedValue(mockAlbum);

    // Controller の getAlbum を実行し、戻り値を result に格納
    const result = await albumController.getAlbum(mockId);

    // サービスの戻り値がそのまま返っていることを確認
    expect(result).toEqual(mockAlbum);
  });

  // album?artist=...&limit=... に関するテスト
  test('サービスが呼び出されたこと', async () => {
    // getAlbumByArtistName をモック化し、mockAlbum を返すよう設定
    const mockedFn = (
      albumService.getAlbumByArtistName as jest.Mock
    ).mockResolvedValue(mockAlbum);

    // Controller の getAlbumByQuery を実行（引数を渡して呼び出す）
    await albumController.getAlbumByQuery(mockArtist, mockLimit);

    // モック関数が mockArtist, mockLimit の引数で呼び出されたことを確認
    expect(mockedFn).toHaveBeenCalledWith(mockArtist, mockLimit);
  });

  test('サービスの返却値がそのまま返されること', async () => {
    (albumService.getAlbumByArtistName as jest.Mock).mockResolvedValue(
      mockAlbum,
    );

    // Controller の getAlbumByQuery を実行し、戻り値を result に格納
    const result = await albumController.getAlbumByQuery(mockArtist, mockLimit);

    // サービスの戻り値がそのまま返っていることを確認
    expect(result).toEqual(mockAlbum);
  });
});
