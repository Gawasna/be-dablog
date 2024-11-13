import { Inject, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { join } from 'path';
import { Response } from 'express';

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
  ) { }

  async liveSearch(query: string): Promise<Partial<Posts>[]> {
    const cacheKey = `live_search:${query}`;
    const cachedResults = await this.cacheManager.get(cacheKey);
    if (cachedResults) {
      return cachedResults as Partial<Posts>[];
    }
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
      .select(['post.id', 'post.title', 'post.image_path', 'post.created_at', 'category.name'])
      .orderBy('post.created_at', 'DESC')
      .limit(6)
      .getMany();
  }


  async getPopularPosts(): Promise<Posts[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoin('post_statistics', 'stats', 'stats.post_id = post.id')
      .select(['post.title', 'post.image_path', 'post.created_at', 'category.name', 'stats.like_count'])
      .orderBy('stats.like_count', 'DESC')
      .limit(5)
      .getMany();
  }

  async getPost(post_id: number): Promise<Posts> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.id = :post_id', { post_id })
      .getOne();
  }
  // async GetDetailPost(post_id: number): Promise<Posts> {

  //   const post = await this.postRepository
  //     .createQueryBuilder('post')
  //     .where('post.id = :post_id', { post_id })
  //     .getOne();

  //   const imageUrl = post.image_path.startsWith('http') 
  //     ? post.image_path 
  //     : join(process.cwd(), 'uploads', 'thumbnails', post.image_path);

  //   const contentPath = post.content_path.startsWith('http')
  //     ? post.content_path
  //     : join(process.cwd(), 'uploads', 'content', post.content_path);

  //   return await this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoinAndSelect('post.category', 'category')
  //     .where('post.id = :post_id', { post_id })
  //     .getOne();
  // }
}
