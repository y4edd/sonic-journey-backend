import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/user.dto';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { AuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ユーザー登録
  @Post()
  signUp(@Body() dto: RegisterDTO) {
    console.log('サインアップはしる');
    return this.userService.signUp(dto);
  }

  // ユーザー情報を取得する
  // ここでAuthGuardを使い、Cookieの中のJWTを
  // 改ざんがないか、ユーザーIDは何かを検証する
  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@Req() request: RequestWithCookies) {
    return request.user;
  }

  // ユーザー情報を編集する
  @Patch('me')
  @UseGuards(AuthGuard)
  patchUser(@Body() dto: RegisterDTO, @Req() request: RequestWithCookies) {
    return this.userService.patchUser(dto, request);
  }

  // ユーザー削除（退会）
  @Delete('me')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Req() request: RequestWithCookies,
    // NestJSに任せる（+expressのcookie機能も使いたい）
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('delete走る');
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
