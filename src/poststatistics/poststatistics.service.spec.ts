import { Test, TestingModule } from '@nestjs/testing';
import { PoststatisticsService } from './poststatistics.service';

describe('PoststatisticsService', () => {
  let service: PoststatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoststatisticsService],
    }).compile();

    service = module.get<PoststatisticsService>(PoststatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
