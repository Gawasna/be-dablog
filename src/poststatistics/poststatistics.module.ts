// post-statistics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostStatisticsRepository } from './post-statistics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostStatisticsRepository])],
  providers: [ PostStatisticsRepository],
  exports: [PostStatisticsRepository],
})
export class PostStatisticsModule {}