// post-statistics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostStatisticsRepository } from './post-statistics.repository';
import { PostStatisticsService } from './poststatistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostStatisticsRepository])],
  providers: [PostStatisticsService, PostStatisticsRepository],
  exports: [PostStatisticsService, PostStatisticsRepository],
})
export class PostStatisticsModule {}