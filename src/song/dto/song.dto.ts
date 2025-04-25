import { IsOptional, IsString, IsInt } from 'class-validator';

export class GetSongsDto {
  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsInt()
  limit: number;
}
