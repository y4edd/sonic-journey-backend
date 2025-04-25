import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SongService } from './song.service';
import { GetSongsDto } from './dto/song.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // ランキング楽曲
  @Get('ranking')
  // limitを自動的にnumberに変換
  getRankingSong(@Query('limit', ParseIntPipe) limit: number) {
    return this.songService.getRankingSong(limit);
  }
  // 新曲
  @Get('new')
  getNewSong(@Query('limit', ParseIntPipe) limit: number) {
    return this.songService.getNewSong(limit);
  }

  // アーティストのIDから人気曲を取得する関数
  @Get()
  getSongByQuery(@Query() query: GetSongsDto) {
    const { artistId, word, limit } = query;
    console.log(artistId, word, limit);

    if (artistId) {
      return this.songService.getSongByArtistId(artistId, limit);
    }

    if (word) {
      return this.songService.getSongByWord(word);
    }
  }

  // 楽曲のIDから楽曲を取得する
  @Get(':id')
  getSongById(@Param('id') id: string) {
    return this.songService.getSongBySongId(id);
  }
}
