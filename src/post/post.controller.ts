import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LiveSearchDto } from './dto/live-search.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FilesService } from 'src/files/files.service';

@Controller('api/post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        // private readonly fileService: FilesService
    ) {}

    // @SkipThrottle({default: true})
    // @Throttle({ browse_posts: {} })
    @Get('latest')
    async getLatestPosts() {
        return await this.postService.getLatestPosts();
    }
    
    @Get('live-search')
    @UseInterceptors(CacheInterceptor)
    async liveSearch(@Query() searchDto: LiveSearchDto) {
        return await this.postService.liveSearch(searchDto.query); 
    }

    @Get('/banner')
    async getBanner() {
        return await this.postService.getLatestBanners();
    }

    @Get('post/:id')
    async getPostById(@Query('id') id: number) {
        return await this.postService.getPost(id);
    }

    @Get('search')
    async searchPostbyTitle(@Query('title') title: string) {
        // return await this.postService.searchPost(title);
        return await ('this should be a search function');
    }
}
