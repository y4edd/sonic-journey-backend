import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { AlbumController } from './album/album.controller';
import { AlbumService } from './album/album.service';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [ArtistModule, AlbumModule],
  controllers: [AppController, AlbumController],
  providers: [AppService, AlbumService],
})
export class AppModule {}
