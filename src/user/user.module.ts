import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Users } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule, // Import ConfigModule here
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}