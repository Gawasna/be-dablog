import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Posts } from 'src/post/entities/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategory(skip: number = 0, take: number = 3): Promise<Category[]> {
    return await this.categoryRepository.find({
      skip: skip,
      take: take,
      order: {
        id: 'ASC'
      }
    });
  }

  async getPostsByCategoryId(categoryId: string, page: number = 1, limit: number = 6): Promise<Posts[]> {
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
      .where('post.category_id = :categoryId', { categoryId })
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}