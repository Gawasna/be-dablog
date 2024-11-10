import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LiveSearchDto } from './dto/live-search.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/post')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}

    @SkipThrottle({default: true})
    @Throttle({ browse_posts: {} })
    @Get('latest')
    async getLatestPosts() {
        return await this.postService.getLatestPosts();
    }
    
    @Get('live-search')
    @UseInterceptors(CacheInterceptor)
    @Throttle({ live_searching: {} })
    async liveSearch(@Query() searchDto: LiveSearchDto) {
        return await this.postService.liveSearch(searchDto.query); 
    }

    @Get('/banner')
    async getBanner() {
        return await this.postService.getLatestBanners();
    }


}
