import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // AppModule を使って NestJS アプリケーションのインスタンス（app）を作成する
  const app = await NestFactory.create(AppModule);

  // ValidationPipe というNestJSに組み込まれているパイプクラスを使って、
  // リクエストの入力値をアプリ全体でチェックする
  // 「whitelist: true」によってDTOで定義されていないプロパティは自動的に削除される
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // cookieの認証は必要だけど、バックエンドが公開されないから別にやる意味がない
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

  await app.listen(3005);
  console.log(`🌟 アプリが起動しました → ${await app.getUrl()}`);
}
bootstrap();
