import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

// First create a DTO for query parameters
export class GetCategoriesQueryDto {
  @ApiProperty({ required: false, default: 0 })
  skip?: number;

  @ApiProperty({ required: false, default: 3 })
  take?: number;
}

@Controller('api/categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiResponse({ status: 200, type: [Category] })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getCategories(
    @Query() query: GetCategoriesQueryDto
  ): Promise<Category[]> {
    const { skip = 0, take = 3 } = query;
    return await this.categoryService.getCategory(skip, take);
  }
}