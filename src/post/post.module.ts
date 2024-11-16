// post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banners, Posts]),
    CacheModule.register({
      ttl: 60000, // 1 minute cache TTL
      max: 100, // maximum number of items in cache
    }),
  ],
  providers: [PostService, FilesService],
  controllers: [PostController],
  exports: [PostService]
})
export class PostModule {}