import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
}