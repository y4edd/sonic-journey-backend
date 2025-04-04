import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  // IDからアーティスト情報をDeezerAPIより取得
  @Get(':id')
  getArtist(@Param('id') id: string) {
    console.log('IDを受け取りました:', id);
    return this.artistService.getArtistById(id);
  }

  // １つのエンドポイントで複数のクエリを処理するようにする
  @Get()
  getArtistByQuery(
    @Query('word') word: string,
    @Query('genre') genre: number,
    @Query('limit') limit: string,
  ) {
    console.log('limit', limit);
    if (word) {
      console.log('artistにてwordを受け取りました:', word);
      return this.artistService.getArtistByWord(word, limit);
    }
    if (genre) {
      console.log('artistにてgenreを受け取りました:', genre);
      return this.artistService.getArtistByGenre(genre, limit);
    }
    return { message: 'クエリパラメータが必要です' };
  }
}
