import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { dataSourceOptions } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { MailModule } from './mail/mail.module';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { CommentModule } from './comment/comment.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { PostStatisticsModule } from './poststatistics/poststatistics.module';
import { ThrottlerModule } from '@nestjs/throttler';

const dotenv = require('dotenv');
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      logging: false,
      logger: 'advanced-console',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      max: 1000,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UserModule,
    PostModule,
    CategoryModule,
    MailModule,
    AuthModule,
    CommentModule,
    AdminModule,
    PostStatisticsModule,
  ],
  controllers: [
    AppController,
    CommentController,
    FilesController,
    AdminController,
  ],
  providers: [
    AppService,
    CommentService,
    FilesService,
    AdminService,
  ],
})
export class AppModule {}
