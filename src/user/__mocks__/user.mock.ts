import { Response } from 'express';
import { mock } from 'jest-mock-extended';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { RegisterDTO } from '../dto/user.dto';

export const mockUserDTO: RegisterDTO = {
  name: 'test',
  email: 'test@test.com',
  password: 'testtest',
};

export const mockResolveResponse = {
  message: 'ok',
};

export const mockGetUserResponse = {
  name: 'test',
  id: 'testId',
  email: 'test@test.com',
  password: 'testtest',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Requestの型はモックライブラリ「jest-mock-extended」で形を自動で補完する
export const mockGetUserReq = mock<RequestWithCookies>();
mockGetUserReq.cookies = { access_token: 'test' };
mockGetUserReq.user = {
  id: 'testId',
  email: 'test@test.com',
  name: 'test',
};

// トークンの中のid情報が空
export const mockGetUserEmptyReq = mock<RequestWithCookies>();
mockGetUserEmptyReq.cookies = { access_token: 'test' };
mockGetUserEmptyReq.user = {
  id: '',
  email: 'test@test.com',
  name: 'test',
};

// Responseの型をモックで作る
export const mockResponse = mock<Response>();

// hash化されたパスワード
export const mockHashedPassword: string = 'hashedpassword123';

export const mockResolveEmptyResponse = {
  message: 'ok',
  id: '',
};
