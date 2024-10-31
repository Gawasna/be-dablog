import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    async findAll(): Promise<Users[]> {
        return await this.usersRepository.find(
            { select: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'] }
        );
    }
}
