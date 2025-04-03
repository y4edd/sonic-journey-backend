import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  // アルバムIDからアルバム情報を取得する
  @Get(':id')
  getAlbum(@Param('id') id: number) {
    console.log('albumId取得', id);
    return this.albumService.getAlbumById(id);
  }

  // アーティスト名からアルバムを取得する
  @Get()
  getAlbumByQuery(
    @Query('artist') artistName: string,
    @Query('limit') limit: number,
  ) {
    console.log('albumにて、artistを取得', artistName);
    return this.albumService.getAlbumByArtistName(artistName, limit);
  }
}
