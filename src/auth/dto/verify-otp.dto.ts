// verify-otp.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class VerifyOtpDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;
}
