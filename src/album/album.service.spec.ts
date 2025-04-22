import {
  fakeApiResponse,
  mockApiResponse,
  mockErrorResponse,
  mockResponse,
} from './__mocks__/album.service.mock';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let albumService: AlbumService;

  // 外部依存している箇所を全てモック化する
  beforeEach(() => {
    // これをせず、いきなりtestスコープ内で中の関数を使おうとすると
    // インスタンスが生成さえていないのでエラーが出る
    // （下記により、このクラスのオブジェクが作られ、メソッドを使うことができる）
    albumService = new AlbumService();
    global.fetch = jest.fn(); // fetch を上書き（モック化）
    // console.error を無効化してテスト用に監視
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // 「album/:id」のテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => fakeApiResponse,
    });

    const result = await albumService.getAlbumById(1);

    expect(result).toEqual({
      id: 1,
      title: 'test album',
      cover_xl: 'cover.jpg',
      nb_tracks: 10,
      artist: {
        id: 2,
        name: 'test artist',
        picture_xl: 'artist.jpg',
      },
      albumSongs: [
        {
          id: 100,
          title: 'test song',
          duration: 120,
          preview: 'preview.mp3',
          cover_xl: 'song_cover.jpg',
        },
      ],
    });
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    // 今回、DeezerAPIから帰ってくるのはエラーオブジェクト

    // 外部APIからの返却がエラーになる状況をモックで再現
    (fetch as jest.Mock).mockRejectedValue(mockErrorResponse);

    const result = await albumService.getAlbumById(1);
    expect(console.error).toHaveBeenCalledWith(
      'API取得に失敗:',
      mockErrorResponse,
    );
    expect(result).toBeNull();
  });

  test('APIレスポンスがnullの時にconsole.errorが呼ばれること', async () => {
    // 外部APIの返却がnullになる状況をモックで再現
    (fetch as jest.Mock).mockRejectedValue(null);
    const result = await albumService.getAlbumById(1);
    expect(result).toBeNull();
  });

  // 「album/?artist=...&limit=...」のテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    // fetchをモック化し、返り値をこちらで設定
    (fetch as jest.Mock).mockResolvedValue({
      json: () => mockApiResponse,
    });

    const result = await albumService.getAlbumByArtistName('test artist', 1);
    expect(result).toEqual(mockResponse);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (fetch as jest.Mock).mockRejectedValue(mockErrorResponse);

    await albumService.getAlbumByArtistName('test artist', 1);
    expect(console.error).toHaveBeenCalledWith(mockErrorResponse);
  });

  test('APIレスポンスがnullの時にconsole.errorが呼ばれること', async () => {
    // 外部APIの返却がnullになる状況をモックで再現
    (fetch as jest.Mock).mockRejectedValue(null);
    const result = await albumService.getAlbumByArtistName('test artist', 1);
    expect(result).toBeNull();
  });
});
