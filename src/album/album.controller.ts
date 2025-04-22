import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  // アルバムIDからアルバム情報を取得する
  @Get(':id')
  getAlbum(@Param('id') id: number) {
    return this.albumService.getAlbumById(id);
  }

  // アーティスト名からアルバムを取得する
  @Get()
  getAlbumByQuery(
    @Query('artist') artistName: string,
    @Query('limit') limit: number,
  ) {
    return this.albumService.getAlbumByArtistName(artistName, limit);
  }
}
