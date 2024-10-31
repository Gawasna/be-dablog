import { AuthService } from './auth.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { Users } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private AuthService: AuthService){}

    @Post('signup')
    @UsePipes(ValidationPipe)
    async signup(@Body() SignupUserDto:SignupUserDto): Promise<Users> {
        console.log('Dang ki...');
        const user = await this.AuthService.signup(SignupUserDto);
        console.log('Thong tin dang ki', user);
        return user;
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto:LoginUserDto): Promise<any> {
        console.log('Dang nhap...')
        return this.AuthService.login(LoginUserDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() {refresh_Token}): Promise<any> {
        console.log('refreshing...');
        return this.AuthService.refreshToken(refresh_Token);
    }
}