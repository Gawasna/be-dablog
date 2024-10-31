import { JwtPayload } from './../../node_modules/@types/jsonwebtoken/index.d';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private usersRepository:Repository<Users>,
        private JwtService:JwtService,
        private ConfigService:ConfigService
    ){}

    async signup (SignupUserDto:SignupUserDto): Promise<Users> {
        //Bcrypt
        const hashpassword = await this.hashpassword(SignupUserDto.password);
        return await this.usersRepository.save({...SignupUserDto, refresh_token:"refresh_token_default", password:hashpassword});
    }

    async login (LoginUserDto:LoginUserDto):Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email: LoginUserDto.email } });
        if(!user) {
            throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED);
            return {message: 'User not found'};
        }
        const isMatch = await bcrypt.compare(LoginUserDto.password, user.password);
        //Tối ưu hiệu suất
        if(!isMatch) {
            throw new HttpException("Password is incorrect", HttpStatus.UNAUTHORIZED);
            return {message: 'Password is incorrect'};
        }
        //Tạo access token và refresh token
        const payload = {id:user.id, email:user.email};
        return this.generateToken(payload);
    }

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
                //return this.generateToken({id: verify.id, email: verify.email});
            } else {
                throw new HttpException("Refresh token is not exist", HttpStatus.BAD_REQUEST);
            }
        } catch(error) {
            throw new HttpException("Refresh token is expired", HttpStatus.BAD_REQUEST);
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
        return {access_Token, refresh_Token};
    }

    private async hashpassword(password:string):Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

}
