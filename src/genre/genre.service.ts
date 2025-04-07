import { Injectable } from '@nestjs/common';
import { GenreData, GenreDataResponse } from './interfaces/genre.interfece';

@Injectable()
export class GenreService {
  async getGenre() {
    const response = await fetch('https://api.deezer.com/genre');

    if (!response) {
      console.error('ジャンルに関する情報は見つかりませんでした');
    }
    const res = (await response.json()) as GenreDataResponse;
    // 不要な情報を取り除きます
    const data = res.data.map((d: GenreData) => {
      return {
        id: d.id,
        name: d.name,
        picture: d.picture_medium,
      };
    });
    return data;
  }
}
