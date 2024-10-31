import { Contains, IsEmail, IsNotEmpty } from "class-validator";

export class SignupUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
    //add avatar in future
    status: number;
}