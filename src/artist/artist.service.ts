import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { DeezerArtist, DeezerResponse } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  async getArtistById(id: string) {
    const response = await fetch(`https://api.deezer.com/artist/${id}`);
    const res = (await response.json()) as DeezerResponse;
    return res;
  }

  async getArtistByWord(word: string, limit: string) {
    const response = await fetch(
      `https://api.deezer.com/search/artist?q=${word}&limit=${limit}`,
    );
    const res = (await response.json()) as DeezerResponse;

    const resData = res.data.map((data: DeezerArtist) => {
      return {
        id: data.id,
        name: data.name,
        picture_xl: data.picture_xl,
      };
    });
    return resData;
  }

  async getArtistByGenre(genre: number, limit: string) {
    const response = await fetch(
      `https://api.deezer.com/genre/${genre}/artists&limit=${limit}`,
    );
    const res = (await response.json()) as DeezerResponse;
    const resData = res.data.map((data: DeezerArtist) => {
      return {
        id: data.id,
        name: data.name,
        picture_xl: data.picture_xl,
      };
    });
    return resData;
  }
}
