import { ApiProperty } from '@nestjs/swagger';

export class AlbumSongDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  duration: string;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  cover_xl: string;
}

export class ArtistDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  picture_xl: string;
}

export class AlbumDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  cover_xl: string;

  @ApiProperty()
  nb_tracks: string;

  @ApiProperty({ type: ArtistDto })
  artist: ArtistDto;

  @ApiProperty({ type: [AlbumSongDto] })
  albumSongs: AlbumSongDto[];
}
