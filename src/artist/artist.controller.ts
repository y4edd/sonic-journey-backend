import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  // IDからアーティスト情報をDeezerAPIより取得
  @Get(':id')
  getArtist(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  // １つのエンドポイントで複数のクエリを処理するようにする
  @Get()
  getArtistByQuery(
    @Query('word') word: string,
    @Query('genre') genre: number,
    @Query('limit') limit: string,
  ) {
    if (word) {
      return this.artistService.getArtistByWord(word, limit);
    }
    if (genre) {
      return this.artistService.getArtistByGenre(genre, limit);
    }
    return { message: 'クエリパラメータが必要です' };
  }
}
