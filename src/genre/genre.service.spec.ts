import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { mockGenreService, mockResponse } from './__mocks__/genre.service.mock';

describe('GenreService', () => {
  let genreService: GenreService;

  beforeEach(async () => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error');
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenreService],
    }).compile();

    genreService = module.get<GenreService>(GenreService);
  });

  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => mockResponse,
    });
    const result = await genreService.getGenre();
    expect(result).toEqual(mockGenreService);
  });

  test('fetchや外部APIが失敗したときにconsole.errorされること', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('通信エラー'));

    // 呼び出す
    await genreService.getGenre();

    // 呼び出したか確認
    expect(console.error).toHaveBeenCalledWith(new Error('通信エラー'));
  });

  test('APIレスポンスがnullのときにconsole.errorが呼ばれること', async () => {
    // fetchは失敗するとエラーオブジェクトを返す
    (fetch as jest.Mock).mockRejectedValue(new Error('通信エラー'));

    // 呼び出す
    const result = await genreService.getGenre();

    expect(result).toEqual(null);
  });
});
