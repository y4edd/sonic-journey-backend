import { Test, TestingModule } from '@nestjs/testing';
import { PickService } from './pick.service';
import { mockPickId, mockSpecialSongs } from './__mocks__/pick.controller.mock';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PickService', () => {
  let pickService: PickService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // console.errorを監視対象とする
    jest.spyOn(console, 'error').mockImplementation();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PickService,
        {
          provide: PrismaService,
          // PrismaServiceのfindMany()はモデル単位で名前空間が分かれている
          // （pick.findMany()とpick_Song.findMany()はレスポンスが
          // ちがうのでそれぞれ別に定義されている）
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

    pickService = module.get<PickService>(PickService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // pickのテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (prismaService.pick.findMany as jest.Mock).mockResolvedValue([
      mockSpecialSongs,
    ]);
    const result = await pickService.getPick();

    expect(result).toEqual([mockSpecialSongs]);
  });

  test('DB操作が失敗したときにconsole.errorされること', async () => {
    const error = new Error('通信エラー');
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    (prismaService.pick.findMany as jest.Mock).mockRejectedValue(error);
    try {
      await pickService.getPick();
    } catch (e) {
      // error が発生するのは想定内
      console.error(e);
    }
    expect(consoleErrorMock).toHaveBeenCalledWith(error);
    // 他テストに影響しないように
    consoleErrorMock.mockRestore();
  });

  // pick/:idのテスト
  test('APIから取得した情報が期待通りに整形されていること', async () => {
    (prismaService.pick_Song.findMany as jest.Mock).mockResolvedValue([
      mockSpecialSongs,
    ]);
    const result = await pickService.getPickSong(mockPickId);

    expect(result).toEqual([mockSpecialSongs]);
  });

  test('DB操作が失敗したときにconsole.errorされること', async () => {
    const error = new Error('通信エラー');
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    (prismaService.pick_Song.findMany as jest.Mock).mockRejectedValue(error);
    try {
      await pickService.getPickSong(mockPickId);
    } catch (e) {
      // error が発生するのは想定内
      console.error(e);
    }
    expect(consoleErrorMock).toHaveBeenCalledWith(error);
    // 他テストに影響しないように
    consoleErrorMock.mockRestore();
  });
});
