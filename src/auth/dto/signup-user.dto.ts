import { IsEmail, IsNotEmpty, IsOptional, Min, MinLength } from "class-validator";

export class SignupUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    //@MinLength(6)
    password: string;

    //add avatar in future
    @IsOptional()
    status: number;
}