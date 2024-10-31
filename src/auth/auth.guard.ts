import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { Users } from "src/user/entities/user.entity"; // Import entity
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(Users) private userRepository: Repository<Users> // Inject repository for user
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            });
            
            // Lấy thông tin người dùng từ cơ sở dữ liệu và kiểm tra vai trò
            const user = await this.userRepository.findOne({ where: { id: payload.id } });
            if (!user) throw new UnauthorizedException('User not found');
            
            request['user_data'] = { ...payload, role: user.role }; // Gắn role từ DB vào payload
        } catch (error) {
            throw new HttpException({
                status: 419,
                message: "Token expired or invalid"
            }, 419);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
        return type === 'Bearer' ? token : undefined;
    }
}
