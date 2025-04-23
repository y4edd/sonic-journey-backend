import { Test, TestingModule } from '@nestjs/testing';
import { PickController } from './pick.controller';
import { PickService } from './pick.service';
import { mockPickId, mockSpecialSongs } from './__mocks__/pick.controller.mock';
import { PrismaService } from '../prisma/prisma.service';

describe('PickController', () => {
  let pickController: PickController;
  let pickService: PickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PickController],
      providers: [
        {
          provide: PickService,
          // PickServiceをオーバーライドする
          // （DIの解決結果を下記において上書きする）
          // インスタンスなので当然オブジェクト
          useValue: {
            getPick: jest.fn(),
            getPickSong: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            pick: {
              findMany: jest.fn(),
            },
            pick_Song: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // 上で宣言したモジュールの中のPickControllerを注入
    pickController = module.get<PickController>(PickController);
    pickService = module.get<PickService>(PickService);
  });

  // /pickのテスト
  test('pickService の get系関数が呼ばれること', async () => {
    const mockedFn = (pickService.getPick as jest.Mock).mockResolvedValue(
      mockSpecialSongs,
    );

    await pickController.getPick();

    expect(mockedFn).toHaveBeenCalled();
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (pickService.getPick as jest.Mock).mockResolvedValue(mockSpecialSongs);
    const result = await pickController.getPick();

    expect(result).toEqual(mockSpecialSongs);
  });

  // /pick/:idのテスト
  test('pickService の get系関数が呼ばれること', async () => {
    const mockedFn = (pickService.getPickSong as jest.Mock).mockResolvedValue(
      mockSpecialSongs,
    );

    await pickController.getPickSong(mockPickId);

    expect(mockedFn).toHaveBeenCalled();
  });

  test('サービスの返却値がそのまま返ること', async () => {
    (pickService.getPickSong as jest.Mock).mockResolvedValue(mockSpecialSongs);
    const result = await pickController.getPickSong(mockPickId);

    expect(result).toEqual(mockSpecialSongs);
  });
});
