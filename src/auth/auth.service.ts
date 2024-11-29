import { UserService } from './../user/user.service';
import { JwtPayload } from './../../node_modules/@types/jsonwebtoken/index.d';
import { MailService } from '../mail/mail.service';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(Users) 
        private usersRepository:Repository<Users>,
        private JwtService:JwtService,
        private ConfigService:ConfigService,
        private readonly mailService: MailService,
        private readonly userService: UserService
    ){}

    async signup (SignupUserDto:SignupUserDto): Promise<Users> {
        const checkExistEmail = await this.usersRepository.findOne({ where: { email: SignupUserDto.email } });
        if (checkExistEmail) {
            throw new HttpException({ message: 'Email already exists' }, HttpStatus.BAD_REQUEST);
        }
        const existingUserByUsername = await this.usersRepository.findOne({ where: { username: SignupUserDto.username } });
        if (existingUserByUsername) {
            throw new HttpException({message: 'Username already exist'}, HttpStatus.BAD_REQUEST);
        }
        const hashpassword = await this.hashpassword(SignupUserDto.password);
        const userD = {
            ...SignupUserDto,
            password: hashpassword,
            refresh_token: 'default-refresh-token',
            role: 'user'
        };
        return await this.usersRepository.save(userD);
    }

    // async login (LoginUserDto:LoginUserDto):Promise<any> {
    //     const user = await this.usersRepository.findOne({ where: { email: LoginUserDto.email } });
    //     if(!user) {
    //         throw new HttpException({message: 'email is not exist'}, HttpStatus.UNAUTHORIZED);
    //     }
    //     const isMatch = await bcrypt.compare(LoginUserDto.password, user.password);
    //     if(!isMatch) {
    //         throw new HttpException({message:'Password is incorrect'}, HttpStatus.UNAUTHORIZED);
    //     }
    //     const payload = {id:user.id, email:user.email};
    //     return this.generateToken(payload);
    // }

    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.JwtService.verifyAsync(refresh_token, {
                secret: this.ConfigService.get<string>('JWT_SECRET'),
            })
            console.log('Refresh token is valid', verify);
            const checkExistToken = await this.usersRepository.findOne({where: {email: verify.email, refresh_token}});
            if (checkExistToken) {
                const payload = {id:checkExistToken.id, email:checkExistToken.email};
                return this.generateToken(payload);
            } else {
                throw new HttpException({message: 'Refresh token is not exist'}, HttpStatus.BAD_REQUEST);
            }
        } catch(error) {
            throw new HttpException({message: 'Refresh token is expired'}, HttpStatus.BAD_REQUEST);
        }
    }

    private async generateToken(payload:{id:number, email:string}) {
        const access_Token = await this.JwtService.signAsync(payload);
        const refresh_Token = await this.JwtService.signAsync(payload, {
            secret: this.ConfigService.get<string>('JWT_SECRET'),
            expiresIn: this.ConfigService.get<string>('JWT_REFRESH_EXP')
        })
        await this.usersRepository.update(
            {email: payload.email},
            {refresh_token: refresh_Token}
        )
        return {
            access_Token, 
            refresh_Token,
            user_id: payload.id // Add user_id to response
        };
    }
    
    async login(LoginUserDto:LoginUserDto): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email: LoginUserDto.email } });
        if(!user) {
            throw new HttpException({message: 'email is not exist'}, HttpStatus.UNAUTHORIZED);
        }
        const isMatch = await bcrypt.compare(LoginUserDto.password, user.password);
        if(!isMatch) {
            throw new HttpException({message:'Password is incorrect'}, HttpStatus.UNAUTHORIZED);
        }
        const payload = {id:user.id, email:user.email};
        return this.generateToken(payload);
    }

    private async hashpassword(password:string):Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async sendOtp(requestOtpDto: RequestOtpDto): Promise<void> {
        const user = await this.userService.findByEmail(requestOtpDto.email);
        if (!user) throw new NotFoundException('User not found');
        const otp = this.generateOtp();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await this.userService.save(user);
        await this.mailService.sendOtpEmail(user.email, otp);
        this.logger.log(`OTP sent to ${user.email}`);
    }

    async verifyOtp({ email, otp, newPassword }: VerifyOtpDto): Promise<void> {
        const user = await this.userService.findByEmail(email);
        if (!user || user.otp !== otp || user.otpExpires < new Date()) {
            throw new BadRequestException('Invalid or expired OTP');
        }
        if (!this.validatePassword(newPassword)) {
            throw new BadRequestException('Password does not meet security requirements');
        }
        const hashedPassword = await this.hashpassword(newPassword);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await this.userService.save(user);
        this.logger.log(`OTP verified and password updated for ${user.email}`);
    }
    private validatePassword(password: string): boolean {
        return password.length >= 8;
    }
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); 
    }
}
