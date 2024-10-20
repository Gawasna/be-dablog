// src/post/post.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('latest')
  async getLatestPosts(): Promise<Post[]> {
    return this.postService.getLatestPosts(3);
  }
}