import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {
  mockGetUserEmptyReq,
  mockGetUserReq,
  mockGetUserResponse,
  mockHashedPassword,
  mockResolveEmptyResponse,
  mockResponse,
  mockUserDTO,
} from './__mocks__/user.mock';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// PrismaServiceをmockDeepしない形にする（ここが最重要）
const prismaServiceMock = {
  user: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaService;

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2025-04-28T00:00:00.000Z').getTime());

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  test('正しい入力でユーザー作成が成功すること', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    (prismaService.user.create as jest.Mock).mockResolvedValue({
      id: 'testId',
      name: mockUserDTO.name,
      email: mockUserDTO.email,
      password: mockHashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: { message: string } = await userService.signUp(mockUserDTO);

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserDTO.password, 12);

    expect(result).toEqual({ message: 'ok' });
  });

  test('同一メールアドレス登録時にForbiddenExceptionを返すこと', async () => {
    // PrismaClientKnownRequestErrorを投げるモックを作成
    const prismaError = {
      code: 'P2002',
      message: 'Unique constraint failed on the fields: (`email`)',
      clientVersion: '6.5.0',
      meta: { target: ['email'] },
      name: 'PrismaClientKnownRequestError',
    } as unknown as PrismaClientKnownRequestError;

    // さらに prototype を設定する（instance of でtrueになってもらうため）
    Object.setPrototypeOf(prismaError, PrismaClientKnownRequestError.prototype);

    // prisma.user.createをモックしてエラーを投げさせる
    jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(prismaError);

    // 実行してエラーがForbiddenExceptionになるか確認
    await expect(userService.signUp(mockUserDTO)).rejects.toThrow(
      ForbiddenException,
    );
  });

  // // user/me(GET)のテスト
  test('トークンが存在する場合にユーザー情報が取得できること', async () => {
    // prisma操作(this.prisma.user.findFirst)の結果が「mockGetUserResponse」を返すようにモック
    jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(mockGetUserResponse);

    // mockGetUserReqを引数に取り、getUserを叩く
    const result = await userService.getUser(mockGetUserReq);
    // 叩いた結果（レスポンス）と「mockGetUserResponse」が同じであることを確認
    expect(result).toEqual(mockGetUserResponse);
  });

  test('トークンが存在しない場合に空データを返すこと', async () => {
    // トークンが存在しない定数を引数に、getUserを叩く
    const result = await userService.getUser(mockGetUserEmptyReq);
    // 検証
    expect(result).toEqual(mockResolveEmptyResponse);
  });

  test('ユーザーが存在しない場合にNotFoundExceptionを返すこと', async () => {
    // エラーインスタンス作成
    const prismaError = new NotFoundException('User not found');

    // prisma操作の結果が「NotFoundException」であるように
    jest.spyOn(prismaService.user, 'findFirst').mockRejectedValue(prismaError);

    await expect(userService.getUser(mockGetUserReq)).rejects.toThrow(
      prismaError,
    );
  });

  // // user/me(PATCH)のテスト
  test('正しい入力でユーザー情報が更新できること', async () => {
    // モック化
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockGetUserResponse);
    jest
      .spyOn(prismaService.user, 'update')
      .mockResolvedValue(mockGetUserResponse);
    // コードを走らせる
    const result = await userService.patchUser(mockUserDTO, mockGetUserReq);
    // 検証
    expect(result).toEqual({ message: 'ok' });
  });

  test('更新対象のユーザーが存在しない場合にForbiddenExceptionを返すこと', async () => {
    // エラーインスタンス作成
    const prismaError = new NotFoundException('User not found');
    // モック化
    jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(prismaError);

    await expect(
      userService.patchUser(mockUserDTO, mockGetUserReq),
    ).rejects.toThrow(prismaError);
  });

  // user/me(DELETE)のテスト
  test('正しいリクエストでユーザーが削除できること', async () => {
    // リクエストの結果をモック化
    // Prismaのdeleteメソッドの返り値はカラムないのデータ（デフォルト）
    jest
      .spyOn(prismaService.user, 'delete')
      .mockResolvedValue(mockGetUserResponse);
    const result = await userService.deleteUser(mockGetUserReq, mockResponse);
    expect(result).toEqual({ message: 'ok' });
  });

  test('response.clearCookieが呼ばれること', async () => {
    await userService.deleteUser(mockGetUserReq, mockResponse);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  });
});
