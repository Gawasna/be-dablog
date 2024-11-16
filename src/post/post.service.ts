import { Inject, Injectable, Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { join } from 'path';
import { Response } from 'express';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostService {

  private readonly CACHE_TTL = 60 * 1000;
  private readonly SEARCH_LIMIT = 5;
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Banners)
    private readonly bannerRepository: Repository<Banners>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) { }

  //done
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

  //done
  async getLatestBanners(): Promise<Banners[]> {
    return await this.bannerRepository
      .createQueryBuilder('banner')
      .orderBy('banner.created_at', 'DESC')
      .limit(5)
      .getMany();
  }

  //soon
  async getLatestPosts(): Promise<Posts[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select(['post.id', 'post.title', 'post.image_path', 'post.created_at', 'category.name'])
      .orderBy('post.created_at', 'DESC')
      .limit(6)
      .getMany();
  }

  //soon
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

  //done
  async getPost(post_id: number): Promise<Posts> {
    const post = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.comments', 'comment')
      .select(['post', 'category.name', 'comment'])
      .where('post.id = :id', { id: post_id })
      .getOne();
    this.logger.log(`Fetching resources with id: ${post_id}`);
    return await post;
  }

  //need fix
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comments = await this.commentRepository.find({
      where: { post_id: postId },
      relations: ['author'],
      order: { created_at: 'DESC' },
    });

    return comments;
  }
}
