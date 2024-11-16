import { IsEmail } from 'class-validator';

export class RequestOtpDto {
    @IsEmail()
    email: string;
}

//NO FIX
