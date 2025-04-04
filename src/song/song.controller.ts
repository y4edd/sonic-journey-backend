import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}
  // アーティストのIDから人気曲を取得する関数
  @Get()
  getSongByQuery(
    @Query('artist-id') artistId: string,
    @Query('word') word: string,
    @Query('limit') limit: number,
  ) {
    if (artistId) {
      console.log('songでアーティストID', artistId);
      return this.songService.getSongByArtistId(artistId, limit);
    }

    if (word) {
      console.log('songでキーワード取得', word);
      return this.songService.getSongByWord(word);
    }
  }

  // 楽曲のIDから楽曲を取得する
  @Get(':id')
  getSongById(@Param('id') id: string) {
    console.log('songで楽曲ID', id);
    return this.songService.getSongBySongId(id);
  }
}
