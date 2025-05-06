import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { mock } from 'jest-mock-extended';
import { AuthDTO } from './interfaces/auth.interface';

describe('AuthController', () => {
  let authController: AuthController;
  const mockRes = mock<Response>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ accessToken: 'test-token' }),
          },
        },
      ],
    }).compile();

    authController = module.get(AuthController);
  });

  describe('POST /auth/login', () => {
    test('cookie が設定される', async () => {
      await authController.login(
        { email: 'test@test.com', password: 'testtest' } as AuthDTO,
        mockRes,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRes.cookie).toHaveBeenCalled();
    });
  });

  describe('POST /auth/logout', () => {
    test('cookie が削除される', () => {
      authController.logout(mockRes);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRes.clearCookie).toHaveBeenCalled();
    });
  });
});
