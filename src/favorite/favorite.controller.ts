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
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { SongsDTO } from 'src/song/dto/song.dto';
import { ArtistsDTO } from 'src/artist/dto/artist.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // 楽曲
  @Get('song')
  getSong(@Req() request: RequestWithCookies) {
    return this.favoriteService.getSong(request);
  }

  @HttpCode(200)
  @Delete('song')
  deleteSong(@Req() request: RequestWithCookies, @Body() dto: SongsDTO) {
    return this.favoriteService.deleteSong(request, dto);
  }

  @Post('song/:id')
  postSong(
    @Req() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.favoriteService.postSong(request, id);
  }

  // アーティスト
  @Get('artist')
  getArtist(@Req() request: RequestWithCookies) {
    return this.favoriteService.getArtist(request);
  }

  @HttpCode(200)
  @Delete('artist')
  deleteArtist(@Req() request: RequestWithCookies, @Body() dto: ArtistsDTO) {
    return this.favoriteService.deleteArtist(request, dto);
  }

  @Post('artist/:id')
  postArtist(
    @Req() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.favoriteService.postArtist(request, id);
  }
}
