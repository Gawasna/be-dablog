import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostStatisticsRepository } from './post-statistics.repository';

@Injectable()
export class PostStatisticsService {
  constructor(
    @InjectRepository(PostStatisticsRepository)
    private readonly statisticsRepo: PostStatisticsRepository,
  ) {}

  async updateLikes(postId: number, increment: boolean): Promise<void> {
    await this.statisticsRepo.increment({ post_id: postId }, 'total_likes', increment ? 1 : -1);
  }

  async updateComments(postId: number, increment: boolean): Promise<void> {
    await this.statisticsRepo.increment({ post_id: postId }, 'total_comments', increment ? 1 : -1);
  }
}
