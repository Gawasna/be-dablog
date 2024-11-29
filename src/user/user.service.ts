import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { ALTCreateUser } from './dto/signup-userR.dto';
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

    async getAlluser(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const [users, total] = await this.usersRepository.findAndCount({
            skip: offset,
            take: limit,
            select: ['id', 'username', 'email', 'role', 'created_at', 'updated_at']
        });
        return {
            users,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async modifyUser(id: number, username: string, email: string): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        user.username = username;
        user.email = email;
        return await this.usersRepository.save(user);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        await this.usersRepository.remove(user);
    }

    async altSignup(altcreateuserDTO: ALTCreateUser): Promise<Users> {
        const { username, email, password, role } = altcreateuserDTO;
        const checkExistEmail = await this.usersRepository.findOne({ where: { email } });
        if (checkExistEmail) {
            throw new Error('Email already exists');
        }
        const existingUserByUsername = await this.usersRepository.findOne({ where: { username } });
        if (existingUserByUsername) {
            throw new Error('Username already exists');
        }
        const hashedPassword = await this.hashPassword(password);
        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            role,
            refresh_token: 'default-refresh-token'
        });
        return await this.usersRepository.save(user);
    }

    async changeRole(userId: number, currentUserId: number): Promise<Users> {
        if (userId === currentUserId) {
            throw new Error('You cannot change your own role');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        user.role = user.role === 'admin' ? 'user' : 'admin';
        return await this.usersRepository.save(user);
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
