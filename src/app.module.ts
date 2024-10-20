import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { User } from './user/user.entity';
import { Category } from './category/category.entity';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [User, Category, ...(Array.isArray(dataSourceOptions.entities) ? dataSourceOptions.entities : [])],
    }),
    PostModule,
  ],
})
export class AppModule {}