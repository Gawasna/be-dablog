// src/post/dto/live-search.dto.ts
import { IsString, MaxLength } from 'class-validator';

export class LiveSearchDto {
  @IsString()
  @MaxLength(100)
  query: string;
}