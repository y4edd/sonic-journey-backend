import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './interfaces/auth.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    // Bodyからデータを取得
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('login処理始まる');
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      // 本番環境なら必ずtrueにすること
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    console.log('logout処理始まる');
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
