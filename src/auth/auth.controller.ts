import { MailService } from './../mail/mail.service';
import { AuthService } from './auth.service';
import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { Users } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler'; 
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

//@SkipThrottle()
@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private AuthService: AuthService,
        private MailService: MailService
    ){}
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

    //MAX 10 request per minute
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60000} })
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto:LoginUserDto): Promise<any> {
        console.log('Dang nhap...')
        try {
            this.logger.log(`User ${LoginUserDto.email} try logging in`);
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

    @Throttle({ default: { limit: 10, ttl: 60000} })
    @Post('request-otp')
    async requestOtp(@Body() requestOtpDto:RequestOtpDto ) {
        return this.AuthService.sendOtp(requestOtpDto);
    }

    @Post('verify-otp&reset-password')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.AuthService.verifyOtp(verifyOtpDto);
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}