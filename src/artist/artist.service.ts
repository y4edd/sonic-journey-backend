import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { DeezerArtist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  async getArtistById(id: string): Promise<DeezerArtist> {
    const response = await fetch(`https://api.deezer.com/artist/${id}`);
    const res = (await response.json()) as DeezerArtist;
    return res;
  }
}
