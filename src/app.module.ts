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
import { GenreService } from './genre/genre.service';
import { GenreController } from './genre/genre.controller';
import { GenreModule } from './genre/genre.module';
import { PrismaModule } from './prisma/prisma.module';
import { PickModule } from './pick/pick.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // prismaの中で使われているConfigモジュールをどこでも使えるようにしておく
    // ※ConfigModuleは環境変数を扱いやすくするようにするModuleです
    ConfigModule.forRoot({ isGlobal: true }),
    ArtistModule,
    AlbumModule,
    SongModule,
    GenreModule,
    PrismaModule,
    PickModule,
  ],
  controllers: [
    AppController,
    AlbumController,
    SongController,
    GenreController,
  ],
  providers: [
    AppService,
    AlbumService,
    SongService,
    GenreService,
    PrismaService,
  ],
})
export class AppModule {}
