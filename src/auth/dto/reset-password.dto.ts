// reset-password.dto.ts
import { IsString, MinLength, IsEmail } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    @MinLength(8)
    newPassword: string;
}
