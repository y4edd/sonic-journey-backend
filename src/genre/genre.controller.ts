import { Controller, Get } from '@nestjs/common';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Get()
  async getGenre() {
    console.log('エンドポイントgenreより情報を取得');
    return this.genreService.getGenre();
  }
}
