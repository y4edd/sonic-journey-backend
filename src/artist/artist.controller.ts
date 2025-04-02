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

  @Get()
  getArtistByWord(@Query('word') word: string) {
    console.log('wordを受け取りました:', word);
    return this.artistService.getArtistByWord(word);
  }
}
