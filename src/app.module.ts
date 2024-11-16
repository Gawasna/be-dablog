import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

import { dataSourceOptions } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { TestController } from './test-con.controller';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { MailModule } from './mail/mail.module';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { CommentModule } from './comment/comment.module';

const dotenv = require('dotenv');
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      max: 1000,
    }),
    UserModule,
    PostModule,
    CategoryModule,
    MailModule,
    AuthModule,
    CommentModule,
  ],
  controllers: [
    AppController,
    TestController,
    CommentController,
    FilesController,
  ],
  providers: [
    AppService,
    //tạm thời vô hiệu hóa toàn cục
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    CommentService,
    FilesService,
  ],
})
export class AppModule {}
