import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { mockGenreResponse } from './__mocks__/genre.controller.mock';

describe('GenreController', () => {
  let genreService: GenreService;
  let genreController: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          // useValueはプロバイダの登録が可能。
          // 各メソッドをモック関数とし、jestが追跡できるようにする
          useValue: {
            getGenre: jest.fn(),
          },
        },
      ],
    }).compile();
    genreService = module.get<GenreService>(GenreService);
    genreController = module.get<GenreController>(GenreController);
  });

  test('genreService の get系関数が呼ばれること', async () => {
    const mockedFn = (genreService.getGenre as jest.Mock).mockResolvedValue(
      mockGenreResponse,
    );

    await genreController.getGenre();

    // 引数「」で、mockedFnが正常に呼び出されたかを確認
    expect(mockedFn).toHaveBeenCalledWith();
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (genreService.getGenre as jest.Mock).mockResolvedValue(mockGenreResponse);

    const result = await genreController.getGenre();

    expect(result).toEqual(mockGenreResponse);
  });
});
