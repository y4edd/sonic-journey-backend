import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FavoriteModule } from './favorite/favorite.module';
import { HistoryModule } from './history/history.module';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { MyLogger } from './logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logger.interceptor';

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
    UserModule,
    AuthModule,
    FavoriteModule,
    HistoryModule,
    PlaylistModule,
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
    UserService,
    MyLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        '/favorite',
        '/favorite/*path',
        'user/*path',
        '/playlist',
        '/playlist/*path',
        '/history',
        '/history/*path',
      );
  }
}
