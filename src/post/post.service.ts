// src/post/post.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getLatestPosts(limit: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { status: 'public' },
      order: { created_at: 'DESC' },
      take: limit,
    });

    return posts.map(post => {
      if (!post.image_path.startsWith('http')) {
        post.image_path = `${process.env.BASE_URL}/uploads/${post.image_path}`;
      }
      return post;
    });
  }
}