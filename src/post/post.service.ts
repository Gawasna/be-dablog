import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banners } from './banner.entity';
import { Posts } from './entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FilesService } from 'src/files/files.service';
import { GetCommentDTO } from 'src/comment/dto/comment.dto';
import { Like } from 'src/comment/entities/like.entity';
import { PostStatistics } from 'src/poststatistics/entities/post-statistics.entity';
import { CreateCommentDTO } from 'src/comment/dto/create-comment.dto';
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
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(PostStatistics)
    private readonly postStatisticsRepository: Repository<PostStatistics>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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

  async getLatestPosts(page: number, limit: number): Promise<Posts[]> {
    const offset = (page - 1) * limit;
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id',
        'post.title',
        'post.description',
        'post.image_path',
        'post.created_at',
        'category.name'
      ])
      .where('post.status = :status', { status: 'public' })
      .orderBy('post.created_at', 'DESC')
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async getPopularPosts(): Promise<Posts[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoin('post_statistics', 'stats', 'stats.post_id = post.id')
      .select([
        'post.id',
        'post.title', 
        'post.description',
        'post.image_path',
        'post.created_at',
        'category.name',
        'stats.total_likes'
      ])
      .where('post.status = :status', { status: 'public' })
      .orderBy('stats.total_likes', 'DESC')
      .addOrderBy('post.created_at', 'DESC') // Added secondary sort by creation date
      .limit(5)
      .getMany();
  }

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

  async getCommentsByPostId(post_id: number, page: number = 1, limit: number = 5): Promise<GetCommentDTO[]> {
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
      .skip((page - 1) * limit)
      .take(limit)
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

  //LIKE UNLIKE POST FUNCTION
  async likePost(postId: number, userId: number): Promise<any> {
    // Check if post exists
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check and create post statistics if not exists
    let postStats = await this.postStatisticsRepository.findOne({
      where: { post_id: postId }
    });

    if (!postStats) {
      postStats = this.postStatisticsRepository.create({
        post_id: postId,
        total_likes: 0,
        total_comments: 0
      });
      await this.postStatisticsRepository.save(postStats);
    }

    // Check if user already liked the post
    const existingLike = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId }
    });

    if (existingLike) {
      // Unlike - remove the like
      await this.likeRepository.remove(existingLike);
      
      // Update statistics
      await this.postStatisticsRepository
        .createQueryBuilder()
        .update()
        .set({ 
          total_likes: () => "total_likes - 1",
          updated_at: () => "CURRENT_TIMESTAMP"
        })
        .where("post_id = :postId", { postId })
        .execute();

      return { message: 'Post unliked successfully' };
    }

    // Create new like
    const newLike = this.likeRepository.create({
      post_id: postId,
      user_id: userId
    });
    await this.likeRepository.save(newLike);

    // Update statistics
    await this.postStatisticsRepository
      .createQueryBuilder()
      .update()
      .set({ 
        total_likes: () => "total_likes + 1",
        updated_at: () => "CURRENT_TIMESTAMP"
      })
      .where("post_id = :postId", { postId })
      .execute();

    return { message: 'Post liked successfully' };
  }

  async checkUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const existingLike = await this.likeRepository.findOne({
      where: { 
        post_id: postId,
        user_id: userId 
      }
    });
  
    return !!existingLike; // Convert to boolean
  }

  //ADD COMMENTS FUNCTION  
  async addComment(postId: number, userId: number, commentDto: CreateCommentDTO) {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let postStats = await this.postStatisticsRepository.findOne({
      where: { post_id: postId }
    });
  
    if (!postStats) {
      postStats = this.postStatisticsRepository.create({
        post_id: postId,
        total_likes: 0, 
        total_comments: 0
      });
      await this.postStatisticsRepository.save(postStats);
    }

    const newComment = this.commentRepository.create({
      post_id: postId,
      user_id: userId,
      content: commentDto.content
    });
    
    await this.commentRepository.save(newComment);
    await this.postStatisticsRepository
      .createQueryBuilder()
      .update()
      .set({ 
        total_comments: () => "total_comments + 1",
        updated_at: () => "CURRENT_TIMESTAMP"
      })
      .where("post_id = :postId", { postId })
      .execute();
  
    // Get updated comment count
    const updatedStats = await this.postStatisticsRepository.findOne({
      where: { post_id: postId }
    });
  
    // Get comment with user details
    const savedComment = await this.commentRepository
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
      .where('comment.id = :id', { id: newComment.id })
      .getOne();
  
    return {
      comment: {
        id: savedComment.id,
        post_id: savedComment.post_id,
        content: savedComment.content,
        created_at: savedComment.created_at,
        user: {
          id: savedComment.user.id,
          username: savedComment.user.username,
          avatar: savedComment.user.avatar
        }
      },
      total_comments: updatedStats.total_comments
    };
  }

  //GET NUM COMMENTS
  async getPostCommentsCount(postId: number): Promise<number> {
    const stats = await this.postStatisticsRepository.findOne({
      where: { post_id: postId }
    });
    return stats?.total_comments || 0;
  }

  async getallposts(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id',
        'post.title',
        'post.description',
        'post.image_path',
        'post.status',
        'category.name',
        'post.created_at'
      ])
      .orderBy('post.created_at', 'DESC')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

      return {
        posts,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit)
        },
      };
  }

  /**
   * Deletes a post by its ID.
   *
   * @param postId - The ID of the post to delete.
   * @returns A promise that resolves when the post is deleted.
   * @throws {NotFoundException} If the post with the given ID is not found.
   *
   * @log Deletes a post with the given ID and logs the action.
   */
  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.remove(post);
    this.logger.error(`Deleted post with id: ${postId}`);
  }

  async modifyPost(postId: number, updateData: Partial<Posts>): Promise<Posts> {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (updateData.title) {
      post.title = updateData.title;
    }
    if (updateData.description) {
      post.description = updateData.description;
    }
    if (updateData.category_id) {
      post.category_id = updateData.category_id;
    }
    if (updateData.status) {
      post.status = updateData.status;
    }

    await this.postRepository.save(post);
    this.logger.error(`Updated post with id: ${postId}`);
    return post;
  }
}
