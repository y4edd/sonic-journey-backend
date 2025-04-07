import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpecialSongs } from './interfaces/pick.interface';

@Injectable()
export class PickService {
  // Prismaを使えるようにします
  constructor(private prisma: PrismaService) {}

  async getPick() {
    return this.prisma.pick.findMany();
  }

  async getPickSong(id: number) {
    const numId = Number(id);
    const pickData = await this.prisma.pick_Song.findMany({
      where: {
        pick_id: numId,
      },
    });
    if (!pickData) {
      console.error('特集ページのプレイリスト曲の情報が見つかりませんでした');
    }
    const numPickSongs: SpecialSongs[] = [];

    // song_api_idをnumberに変換
    pickData.map((song, index) => {
      numPickSongs[index] = {
        id: song.id,
        pick_id: song.pick_id,
        api_song_id: Number(song.api_song_id),
      };
    });
    return numPickSongs;
  }
}
