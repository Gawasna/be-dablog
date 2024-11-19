import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content_path?: string;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  author_id: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsEnum(['public', 'hidden'])
  status: string;
}
