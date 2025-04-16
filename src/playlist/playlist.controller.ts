import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import {
  RequestWithAuthorizationHeader,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { AuthGuard } from 'src/auth/guards/cookie-auth.guard';
import {
  DiffPlaylistsDTO,
  PlaylistDTO,
  PutPlaylistDTO,
} from './dto/playlist.dto';
import { HeaderAuthGuard } from 'src/auth/guards/header-auth.guard';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}
  // サーバーサイドから取得すること
  // ユーザーIDからプレイリストを取得
  @UseGuards(HeaderAuthGuard)
  @Get()
  async getPlaylist(@Request() request: RequestWithAuthorizationHeader) {
    return this.playlistService.getPlaylist(request);
  }

  // ユーザーIDからプレイリストを取得
  // クライアントサイド
  @UseGuards(AuthGuard)
  @Get('/csr/:id')
  async getPlaylistCSR(
    @Request() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.playlistService.getPlaylistCSR(request, id);
  }
  // プレイリストを新規作成する
  @UseGuards(AuthGuard)
  @Post()
  async postPlaylist(
    @Request() request: RequestWithCookies,
    @Body() dto: PlaylistDTO,
  ) {
    return this.playlistService.postPlaylist(request, dto);
  }

  // プレイリストIDから楽曲のapi_song_idなどを取得
  // クエリでプレイリストIDを乗っける
  // サーバーサイド
  @UseGuards(HeaderAuthGuard)
  @Get(':id')
  getSong(
    @Request() request: RequestWithAuthorizationHeader,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.playlistService.getSong(request, id);
  }

  // プレイリストの名前を変更する
  // メソッドはPUT
  @UseGuards(AuthGuard)
  @Put(':id')
  putPlaylistName(
    @Request() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PutPlaylistDTO,
  ) {
    return this.playlistService.putPlaylistName(request, id, dto);
  }

  // プレイリストを削除する
  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePlaylist(
    @Request() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.playlistService.deletePlaylist(request, id);
  }

  // プレイリストの中に音楽を追加する
  @UseGuards(AuthGuard)
  @Post('/music/:id')
  postSongPlaylist(
    @Request() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DiffPlaylistsDTO,
  ) {
    return this.playlistService.postSongPlaylist(request, id, dto);
  }

  // プレイリストから音楽を削除する
  @UseGuards(AuthGuard)
  @Delete('/music/:id')
  deleteSongPlaylist(
    @Request() request: RequestWithCookies,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DiffPlaylistsDTO,
  ) {
    console.log('楽曲id', id);
    console.log('playlist', dto);
    return this.playlistService.deleteSongPlaylist(request, id, dto);
  }
}
