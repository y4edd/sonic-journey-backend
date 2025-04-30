import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/user.dto';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ユーザー登録
  @Post()
  signUp(@Body() dto: RegisterDTO) {
    return this.userService.signUp(dto);
  }

  // ユーザー情報を取得する
  @Get('me')
  getUser(@Req() request: RequestWithCookies) {
    return this.userService.getUser(request);
  }

  // ユーザー情報を編集する
  @Patch('me')
  patchUser(@Body() dto: RegisterDTO, @Req() request: RequestWithCookies) {
    return this.userService.patchUser(dto, request);
  }

  // ユーザー削除（退会）
  @Delete('me')
  async deleteUser(
    @Req() request: RequestWithCookies,
    // NestJSに任せる（+expressのcookie機能も使いたい）
    @Res({ passthrough: true }) response: Response,
  ) {
    // JWTなどが入っているcookie名に応じて削除
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return this.userService.deleteUser(request, response);
  }
}
