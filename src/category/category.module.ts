import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { Posts } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Posts]) // Register the Category repository
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService] // Optional: if you need to use CategoryService in other modules
})
export class CategoryModule {}