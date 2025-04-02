import { Controller, Get, Param } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get(':id')
  getArtist(@Param('id') id: string) {
    console.log('👀 IDを受け取りました:', id);
    return this.artistService.getArtistById(id);
  }
}
