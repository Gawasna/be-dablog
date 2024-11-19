import { Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req, UploadedFiles } from '@nestjs/common';
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
    const thumbnail = files.thumbnail?.[0]?.filename;
    const content = files.content?.[0]?.filename;

    const post = {
      ...createPostDto,
      image_path: thumbnail,
      content_path: content,
    };

    return this.adminService.createPost(post);
  }
}
