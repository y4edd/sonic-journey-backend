import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  mockGetUserReq,
  mockGetUserResponse,
  mockResolveResponse,
  mockResponse,
  mockUserDTO,
} from './__mocks__/user.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signUp: jest.fn(),
            getUser: jest.fn(),
            patchUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // userのテスト
  test('userService の post系関数が呼ばれること', async () => {
    const mockedFn = jest
      .spyOn(userService, 'signUp')
      .mockResolvedValue(mockResolveResponse);
    await userController.signUp(mockUserDTO);
    expect(mockedFn).toHaveBeenCalledWith(mockUserDTO);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    jest.spyOn(userService, 'signUp').mockResolvedValue(mockResolveResponse);
    const result = await userController.signUp(mockUserDTO);
    expect(result).toEqual(mockResolveResponse);
  });

  // user/me(GET)のテスト
  test('userService の get系関数が呼ばれること', async () => {
    const mockedFn = jest
      .spyOn(userService, 'getUser')
      .mockResolvedValue(mockGetUserResponse);
    await userController.getUser(mockGetUserReq);
    expect(mockedFn).toHaveBeenCalledWith(mockGetUserReq);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    jest.spyOn(userService, 'signUp').mockResolvedValue(mockResolveResponse);
    const result = await userController.signUp(mockUserDTO);
    expect(result).toEqual(mockResolveResponse);
  });

  // user/me(PATCH)のテスト
  test('userService の patch系関数が呼ばれること', async () => {
    const mockedFn = jest
      .spyOn(userService, 'patchUser')
      .mockResolvedValue(mockResolveResponse);
    await userController.patchUser(mockUserDTO, mockGetUserReq);
    expect(mockedFn).toHaveBeenCalledWith(mockUserDTO, mockGetUserReq);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    jest.spyOn(userService, 'patchUser').mockResolvedValue(mockResolveResponse);
    const result = await userController.patchUser(mockUserDTO, mockGetUserReq);
    expect(result).toEqual(mockResolveResponse);
  });

  // user/me(DELETE)のテスト
  test('userService の delete系関数が呼ばれること', async () => {
    const mockedFn = jest
      .spyOn(userService, 'deleteUser')
      .mockResolvedValue(mockResolveResponse);
    await userController.deleteUser(mockGetUserReq, mockResponse);
    expect(mockedFn).toHaveBeenCalledWith(mockGetUserReq, mockResponse);
  });

  test('サービスの返却値がそのまま返ること', async () => {
    jest
      .spyOn(userService, 'deleteUser')
      .mockResolvedValue(mockResolveResponse);
    const result = await userController.deleteUser(
      mockGetUserReq,
      mockResponse,
    );
    expect(result).toEqual(mockResolveResponse);
  });
});
