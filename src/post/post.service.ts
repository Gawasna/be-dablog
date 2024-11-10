import { Inject, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class PostService {

  private readonly CACHE_TTL = 60 * 1000;
  private readonly SEARCH_LIMIT = 5;

    constructor(
      @InjectRepository(Banners)
      private readonly bannerRepository: Repository<Banners>,
      @InjectRepository(Posts)
      private readonly postRepository: Repository<Posts>,
      @Inject(CACHE_MANAGER) 
      private cacheManager: Cache
      ) {}

      async liveSearch(query: string): Promise<Partial<Posts>[]> {
        // Check cache first
        const cacheKey = `live_search:${query}`;
        const cachedResults = await this.cacheManager.get(cacheKey);
        if (cachedResults) {
          return cachedResults as Partial<Posts>[];
        }
    
        // Perform search
        const results = await this.postRepository
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.category', 'category')
          .where('post.title LIKE :query', { query: `%${query}%` })
          .select([
            'post.id',
            'post.title', 
            'post.image_path',
            'post.created_at',
            'category.name'
          ])
          .orderBy('post.created_at', 'DESC')
          .limit(this.SEARCH_LIMIT)
          .getMany();
    
        // Cache results
        await this.cacheManager.set(cacheKey, results, this.CACHE_TTL);
        
        return results;
      }

    async getLatestBanners(): Promise<Banners[]> {
      return await this.bannerRepository
        .createQueryBuilder('banner')
        .orderBy('banner.created_at', 'DESC')
        .limit(5)
        .getMany();
    }

    async getLatestPosts(): Promise<Posts[]> {
      return await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .select(['post.title', 'post.image_path', 'post.created_at', 'category.name'])
        .orderBy('post.created_at', 'DESC')
        .limit(6)
        .getMany();
  }
}
