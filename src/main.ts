import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './logger/logger';
import { LoggingInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  // AppModule を使って NestJS アプリケーションのインスタンス（app）を作成する
  const app = await NestFactory.create(AppModule);
  const logger = new MyLogger();

  // グローバル Interceptor を設定
  app.useGlobalInterceptors(new LoggingInterceptor(new MyLogger()));

  // ValidationPipe というNestJSに組み込まれているパイプクラスを使って、
  // リクエストの入力値をアプリ全体でチェックする
  // 「whitelist: true」によってDTOで定義されていないプロパティは自動的に削除される
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // CORSの設定
  app.enableCors({
    // クッキーや認証情報（セッション情報、トークンなど）を
    // フロントエンドからサーバーに送ることを許可する
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  // フロントエンドからうけとったcookieを解析できるように
  // ミドルウェアでcookieParserを実行しておく
  app.use(cookieParser());

  // NestJS上で出力するSwaggerドキュメントの情報を定義する
  const options = new DocumentBuilder()
    .setTitle('APIDocs')
    .setDescription('APIの仕様書です')
    .setVersion('1.0')
    .build();

  // ドキュメントの定義
  const document = SwaggerModule.createDocument(app, options);
  // ドキュメントの起動(/docsでAPIの仕様書を確認できる)
  SwaggerModule.setup('docs', app, document);

  await app.listen(3005);
  logger.log('Application started successfully.');
  logger.log('Docs is here: http://localhost:3005/docs');
}
bootstrap();
