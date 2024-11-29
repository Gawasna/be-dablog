import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, NotFoundException, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Request, Response } from 'express';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LiveSearchDto } from './dto/live-search.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FilesService } from 'src/files/files.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDTO } from 'src/comment/dto/create-comment.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/user/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { Posts } from './entities/post.entity';

@Controller('api/post')
export class PostController {

    private readonly logger = new Logger(PostController.name);

    constructor(
        private readonly postService: PostService,
        private readonly fileService: FilesService,
    ) { }

    // @SkipThrottle({default: true})
    // @Throttle({ browse_posts: {} })
    //GET LATEST POSTS
    @Get('latest')
    async getLatestPosts(@Query('page') page: number, @Query('limit') limit: number) {
        return await this.postService.getLatestPosts(page, limit);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('all-post')
    async getAllposts(
        @Query('page') page: number, 
        @Query('limit') limit: number
    ) {
        return await this.postService.getallposts(page, limit);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('delete-post/:id')
    async delpost(@Param('id') id: number) {
        return await this.postService.deletePost(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Put('modify-post/:id')
    async modifyPost(
        @Param('id') postId: number,
        @Body() updateData: Partial<Posts>
    ) {
        try {
            const updatedPost = await this.postService.modifyPost(postId, updateData);
            return updatedPost;
        } catch (error) {
            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('popular')
    @UseInterceptors(CacheInterceptor)
    async getPopularPosts() {
        return await this.postService.getPopularPosts();
    }

    //LIVE SEARCHING
    @Get('live-search')
    @UseInterceptors(CacheInterceptor)
    async liveSearch(@Query() searchDto: LiveSearchDto) {
        return await this.postService.liveSearch(searchDto.query);
    }

    //GET BANNER
    @Get('/banner')
    async getBanner() {
        return await this.postService.getLatestBanners();
    }

    //GET POST INFO
    @Get('/:id')
    async getPostById(@Param('id') id: number, @Res() res: Response) {
        this.logger.log(`Fetching post with id: ${id}`);
        const post = await this.postService.getPost(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    }

    //GET THUMBNAIL
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

    //GET CONTENT
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

    //GET COMMENTS
    @Get('post/:id/comments')
    async getPostCommentsById(
    @Param('id') id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5
    ) {
    try {
        return await this.postService.getCommentsByPostId(id, page, limit);
    } catch (error) {
        throw new NotFoundException(error.message);
    }
    }

    @Get(':id/check-like')
    @UseGuards(AuthGuard)
    async checkUserLikedPost(
        @Param('id') postId: number,
        @Req() req: Request
    ) {
        try {
            const userId = req['user_data'].id;
            const isLiked = await this.postService.checkUserLikedPost(postId, userId);
            return { isLiked };
        } catch (error) {
            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    //LIKE AND UNLIKE ENDPOINT
    @Post(':id/like')
    @UseGuards(AuthGuard)
    async likePost(
        @Param('id') postId: number,
        @Req() req: Request
    ) {
        try {
            const userId = req['user_data'].id;
            return await this.postService.likePost(postId, userId);
        } catch (error) {
            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    //ADD COMMENT ENDPOINT
    @Post(':id/comment')
    @UseGuards(AuthGuard)
    async addComment(
        @Param('id') postId: number,
        @Body() commentDto: CreateCommentDTO,
        @Req() req: Request
    ) {
        try {
            const userId = req['user_data'].id;
            return await this.postService.addComment(postId, userId, commentDto);
        } catch (error) {
            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    //GET NUM COMMENT ENDPOINT
    @Get('post/:id/comment-count')
    async getPostCommentCount(@Param('id') postId: number) {
        try {
            const count = await this.postService.getPostCommentsCount(postId);
            return {
                post_id: postId,
                total_comments: count
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
