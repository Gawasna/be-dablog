import { Contains, IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class SignupUserRDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    // @MinLength(6)
    password: string;
    //add avatar in future

    //role admin, user
    @IsIn(['admin', 'user'])
    role: string;

    @IsOptional()
    status: number;
}