import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { SongsDTO } from 'src/song/dto/song.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('song')
  getSong(@Req() request: Request) {
    return this.favoriteService.getSong(request);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete('song')
  deleteSong(@Req() request: RequestWithCookies, @Body() dto: SongsDTO) {
    return this.favoriteService.deleteSong(request, dto);
  }

  @UseGuards(AuthGuard)
  @Post('song/:id')
  postSong(
    @Req() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.favoriteService.postSong(request, id);
  }
}
