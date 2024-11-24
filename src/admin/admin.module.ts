import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { Posts } from 'src/post/entities/post.entity';
import { FilesService } from 'src/files/files.service';
import { ConfigModule } from '@nestjs/config';
import { PostStatistics } from 'src/poststatistics/entities/post-statistics.entity';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    TypeOrmModule.forFeature([Users]), 
    TypeOrmModule.forFeature([Posts, PostStatistics])
  ],
  controllers: [AdminController],
  providers: [AdminService, FilesService],
})
export class AdminModule {}