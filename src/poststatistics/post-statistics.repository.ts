import { EntityRepository, Repository } from 'typeorm';
import { PostStatistics } from './entities/post-statistics.entity';

@EntityRepository(PostStatistics)
export class PostStatisticsRepository extends Repository<PostStatistics> {}
