// post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';
import { CommentModule } from 'src/comment/comment.module';
import { PostStatisticsModule } from 'src/poststatistics/poststatistics.module';
import { UserModule } from 'src/user/user.module';
import { Like } from 'src/comment/entities/like.entity';
import { PostStatistics } from 'src/poststatistics/entities/post-statistics.entity';
import { DataSource } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banners, Posts, Like, PostStatistics, Comment]),
    CommentModule,
    PostStatisticsModule,
    UserModule,
    CacheModule.register({
      ttl: 60000,
      max: 100, 
    }),
  ],
  providers: [PostService, FilesService,
  ],
  controllers: [PostController,],
  exports: [PostService, TypeOrmModule.forFeature([Posts])]
})
export class PostModule {}