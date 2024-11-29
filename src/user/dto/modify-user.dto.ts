import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class ModifyUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}