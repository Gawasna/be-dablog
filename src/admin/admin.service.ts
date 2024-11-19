import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../post/entities/post.entity';
import { CreatePostDto } from './dto/post-upload.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
  ) {}

  async createPost(post: CreatePostDto): Promise<Posts> {
    return await this.postsRepository.save(post);
  }

}
