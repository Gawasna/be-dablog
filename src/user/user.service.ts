import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(@InjectRepository(Users) 
    private usersRepository: Repository<Users>,
) {}

    async findAll(): Promise<Users[]> {
        return await this.usersRepository.find(
            { select: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'] }
        );
    }

    findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    findbyOTP(otp: string) {
        return this.usersRepository.findOne({ where: { otp } });
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async updatePassword(userId: number, newPassword: string) {
        const hashedPassword = await this.hashPassword(newPassword);
        await this.usersRepository.update(userId, { password: hashedPassword });
    }

    save(user) {
        return this.usersRepository.save(user);
    }
}
