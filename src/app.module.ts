import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module'; 
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TestController } from './test-con.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot(),
    UserModule,
    PostModule,
    CategoryModule,
    //thử nghiệm throttle
    ThrottlerModule.forRoot([{
      name: 'login_and_signup',
      ttl: 60000,
      limit: 10,
    },{
      name: 'browse_posts',
      ttl: 60000,
      limit: 100,
    }, {
      name: 'live_searching',
      ttl: 60000,
      limit: 50,
    }, {
      name: 'comment',
      ttl: 60000,
      limit: 5,
    }]),
    AuthModule,
  ],
  controllers: [
    AppController,
    TestController
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
