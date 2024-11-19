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
import { GetCommentDTO } from 'src/comment/dto/comment.dto';
import { PostStatisticsService } from 'src/poststatistics/poststatistics.service';

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
    private readonly statisticsService: PostStatisticsService,
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
  async getLatestPosts(page: number, limit: number): Promise<Posts[]> {
    const offset = (page - 1) * limit;
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select(['post.id', 'post.title', 'post.description', 'post.image_path', 'post.created_at', 'category.name'])
      .orderBy('post.created_at', 'DESC')
      .offset(offset)
      .limit(limit)
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
  async getCommentsByPostId(post_id: number): Promise<GetCommentDTO[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.post_id',
        'comment.user_id',
        'comment.content',
        'comment.created_at',
        'user.id',
        'user.username',
        'user.avatar'
      ])
      .where('comment.post_id = :post_id', { post_id })
      .getMany();
  
    return comments.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        avatar: comment.user.avatar
      }
    }));
  }

  async likePost(postId: number): Promise<void> {
    await this.statisticsService.updateLikes(postId, true);
  }

  // async unlikePost(postId: number): Promise<void> {
  //   await this.statisticsService.updateLikes(postId, false);
  // }

  async addComment(postId: number): Promise<void> {
    await this.statisticsService.updateComments(postId, true);
  }

  // async deleteComment(postId: number): Promise<void> {
  //   await this.statisticsService.updateComments(postId, false);
  // }

}
