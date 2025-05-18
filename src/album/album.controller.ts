import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlbumDto } from './dto/album.dto';
import { MyLogger } from 'src/logger/logger';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly logger: MyLogger,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'IDからアルバム情報を取得する' })
  @ApiResponse({
    status: 200,
    description: 'アルバム情報の取得に成功',
    type: AlbumDto,
  })
  @ApiResponse({ status: 404, description: 'アルバムが見つかりませんでした' })
  @ApiResponse({ status: 500, description: 'サーバーエラー' })
  async getAlbum(@Param('id') id: number) {
    this.logger.log(`AlbumController: Fetching album with ID: ${id}`);
    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('アルバムが見つかりませんでした');
    }
    this.logger.log(`AlbumController: Successfully fetched album: ${id}`);
    return album;
  }

  @Get()
  @ApiOperation({ summary: 'アーティスト名からアルバム一覧を取得する' })
  @ApiResponse({
    status: 200,
    description: 'アルバム一覧の取得に成功',
    type: [AlbumDto],
  })
  @ApiResponse({ status: 404, description: 'アルバムが見つかりませんでした' })
  @ApiResponse({ status: 500, description: 'サーバーエラー' })
  async getAlbumByQuery(
    @Query('artist') artistName: string,
    @Query('limit') limit: number,
  ) {
    const albums = await this.albumService.getAlbumByArtistName(
      artistName,
      limit,
    );
    if (!albums || albums.length === 0) {
      throw new NotFoundException('該当するアルバムが見つかりませんでした');
    }
    return albums;
  }
}
