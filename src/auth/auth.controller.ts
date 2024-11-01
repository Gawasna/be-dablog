import { AuthService } from './auth.service';
import { Body, Controller, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { Users } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler'; 

//@SkipThrottle()
@Controller('auth')
export class AuthController {
    //why if put private readonly AuthService: AuthService
    constructor(private AuthService: AuthService){}
    //@SkipThrottle({ default: false })
    @Throttle({ default: { limit: 3, ttl: 60000} })
    @Post('signup')
    @UsePipes(ValidationPipe)
    async signup(@Body() SignupUserDto:SignupUserDto): Promise<Users> {
        try {
            const user = await this.AuthService.signup(SignupUserDto);
            console.log('Thong tin dang ki: ', user);
            return user;
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.BAD_REQUEST
              );
        }
    }

    @Throttle({ default: { limit: 10, ttl: 60000} })
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto:LoginUserDto): Promise<any> {
        console.log('Dang nhap...')
        try {
            return this.AuthService.login(LoginUserDto);
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.UNAUTHORIZED
              );
        }
        
    }

    @Post('refresh-token')
    refreshToken(@Body() {refresh_Token}): Promise<any> {
        console.log('refreshing...');
        return this.AuthService.refreshToken(refresh_Token);
    }
}