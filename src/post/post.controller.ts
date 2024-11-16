import { Controller, Get, Logger, NotFoundException, Param, Query, Res, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Response } from 'express';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LiveSearchDto } from './dto/live-search.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FilesService } from 'src/files/files.service';

@Controller('api/post')
export class PostController {

    private readonly logger = new Logger(PostController.name);

    constructor(
        private readonly postService: PostService,
        // private readonly fileService: FilesService
        private readonly fileService: FilesService
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

    // Endpoint for retrieving the post data as JSON
@Get('post/:id')
async getPostById(@Param('id') id: number, @Res() res: Response) {
    this.logger.log(`Fetching post with id: ${id}`);
    const post = await this.postService.getPost(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
}

// New endpoint for fetching the image thumbnail by post ID
@Get('post/:id/image')
async getPostImageById(
    @Param('id') id: number,
    @Res() res: Response,
    @Query('width') width?: string | number,
    @Query('height') height?: string | number,
) {
    const post = await this.postService.getPost(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    const fileName = post.image_path;
    return await this.fileService.getThumbnail(fileName, res, width, height);
}

@Get('post/:id/content')
async getPostContentById(
    @Param('id') 
    id: number, 
    @Res() res: Response
) {
    const post = await this.postService.getPost(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    const fileName = post.content_path;
    return await this.fileService.getContent(fileName, res);
}

@Get('post/:id/comments')
  async getPostCommentsById(@Param('id') id: number) {
    try {
      return await this.postService.getCommentsByPostId(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


    @Get('search')
    async searchPostbyTitle(@Query('title') title: string) {
        // return await this.postService.searchPost(title);
        return await ('this should be a search function');
    }
}
