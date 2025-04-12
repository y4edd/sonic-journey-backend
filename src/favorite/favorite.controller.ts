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
import {
  RequestWithAuthorizationHeader,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { AuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { SongsDTO } from 'src/song/dto/song.dto';
import { HeaderAuthGuard } from 'src/auth/guards/header-auth.guard';
import { ArtistsDTO } from 'src/artist/dto/artist.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // 楽曲
  @UseGuards(HeaderAuthGuard)
  @Get('song')
  getSong(@Req() request: RequestWithAuthorizationHeader) {
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

  // アーティスト
  @UseGuards(HeaderAuthGuard)
  @Get('artist')
  getArtist(@Req() request: RequestWithAuthorizationHeader) {
    return this.favoriteService.getArtist(request);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete('artist')
  deleteArtist(@Req() request: RequestWithCookies, @Body() dto: ArtistsDTO) {
    return this.favoriteService.deleteArtist(request, dto);
  }

  @UseGuards(AuthGuard)
  @Post('artist/:id')
  postArtist(
    @Req() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.favoriteService.postArtist(request, id);
  }
}
