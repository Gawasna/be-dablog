import { Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req, UploadedFiles, Get, Query } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/user/role.enum';
import { AdminService } from './admin.service';

import { CreatePostDto } from './dto/post-upload.dto';
import { isURL } from 'class-validator';
import * as multer from 'multer';
import { FilesService } from 'src/files/files.service';
import path from 'path';
import { storageConfig } from 'helper/config';

@Controller('admin')
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fileService: FilesService,
  ) { }

  @Post('/create-post')
@Roles(Role.ADMIN)
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'thumbnail', maxCount: 1 },
      { name: 'content', maxCount: 1 },
    ],
    {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const folder = file.fieldname === 'thumbnail' ? 'thumbnails' : 'contents';
          cb(null, `uploads/${folder}`);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    },
  ),
)
async create(
  @Req() req: Request,
  @Body() createPostDto: CreatePostDto,
  @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; content?: Express.Multer.File[] },
) {
  // Helper function to check if string is URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Handle thumbnail path
  let image_path = createPostDto.image_path;
  if (files.thumbnail?.[0]) {
    image_path = files.thumbnail[0].filename;
  } else if (!isValidUrl(createPostDto.image_path)) {
    image_path = null;
  }

  // Handle content path
  let content_path = createPostDto.content_path;
  if (files.content?.[0]) {
    content_path = files.content[0].filename;
  } else if (!isValidUrl(createPostDto.content_path)) {
    content_path = null;
  }

  const post = {
    ...createPostDto,
    image_path,
    content_path,
  };

  return this.adminService.createPost(post);
}

  @Get('/dashboard')
  @Roles(Role.ADMIN)
  async getDashboard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const dashboard = await this.adminService.getDashboardStats(page, limit);
      return dashboard;
    } catch (error) {
      throw new BadRequestException('Failed to fetch dashboard data');
    }
  }

}
