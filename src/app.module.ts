import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { AlbumController } from './album/album.controller';
import { AlbumService } from './album/album.service';
import { AlbumModule } from './album/album.module';
import { SongController } from './song/song.controller';
import { SongService } from './song/song.service';
import { SongModule } from './song/song.module';

@Module({
  imports: [ArtistModule, AlbumModule, SongModule],
  controllers: [AppController, AlbumController, SongController],
  providers: [AppService, AlbumService, SongService],
})
export class AppModule {}
