import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get(':id')
  getArtist(@Param('id') id: string) {
    console.log('IDを受け取りました:', id);
    return this.artistService.getArtistById(id);
  }

  // １つのエンドポイントで複数のクエリを処理するようにする
  @Get()
  getArtistByQuery(
    @Query('word') word?: string,
    @Query('genre') genre?: string,
  ) {
    if (word) {
      console.log('wordを受け取りました:', word);
      return this.artistService.getArtistByWord(word);
    }
    if (genre) {
      console.log('genreを受け取りました:', genre);
      return this.artistService.getArtistByGenre(genre);
    }
    return { message: 'クエリパラメータが必要です' };
  }
}
