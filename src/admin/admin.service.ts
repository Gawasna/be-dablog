import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../post/entities/post.entity';
import { CreatePostDto } from './dto/post-upload.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PostStatistics } from 'src/poststatistics/entities/post-statistics.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(PostStatistics)
    private postStatisticsRepository: Repository<PostStatistics>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {}

  async createPost(post: CreatePostDto): Promise<Posts> {
     // Create post
     const newPost = await this.postsRepository.save(post);

     // Initialize post statistics
     await this.postStatisticsRepository.save({
       post_id: newPost.id,
       total_likes: 0,
       total_comments: 0
     });
 
     return newPost;
  }

  async getDashboardStats(page: number, limit: number) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get posts with their statistics
    const [posts, total] = await this.postsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.statistics', 'stats')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id',
        'post.title', 
        'post.status',
        'post.created_at',
        'category.name',
        'stats.total_likes',
        'stats.total_comments'
      ])
      .orderBy('post.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // Get cache statistics
    const cacheStats = {
      totalCachedItems: (await this.cacheManager.store.keys()).length
    };

    return {
      posts,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      },
      cacheStats
    };
  }

}
