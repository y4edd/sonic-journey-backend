import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
// カスタムのPrismaServiceのクラスに対して、PrismaClientのクラスの
// 機能を取り込むため、extendsで継承して機能を拡張する
export class PrismaService extends PrismaClient {
  // ConfigServiceを注入する
  constructor(private readonly config: ConfigService) {
    // 継承しているPrismaClientクラスの中にあるコンストラクターの
    // 処理をsuperを使って参照することができる
    super({
      // （PrismaClientの中の）PrismaClientOptionsの中の「datasources」フィールド
      // があるので、ここにDBのURLを渡す
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}

// ここまでで、Prismaで定義されているCRUD処理などを使うことができる
