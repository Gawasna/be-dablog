import { Injectable, HttpException, HttpStatus, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, createReadStream, promises as fsPromises, access } from 'fs';
import axios from 'axios';
import * as sharp from 'sharp';
import { isURL } from 'validator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as markdownIt from 'markdown-it';

const dotenv = require('dotenv');
dotenv.config();
@Injectable()
export class FilesService {
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  private readonly logger = new Logger(FilesService.name);

  async getThumbnail(
    fileName: string,
    res: Response,
    width?: string | number,
    height?: string | number,
  ) {
    const decodedFileName = decodeURIComponent(fileName);
    const widthInt = width ? parseInt(width as string, 10) : undefined;
    const heightInt = height ? parseInt(height as string, 10) : undefined;
    if (isURL(decodedFileName, { require_protocol: true })) {
      try {
        this.logger.log(`Fetching file from URL: ${decodedFileName}`);
        const response = await axios.get(decodedFileName, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        if (widthInt || heightInt) {
          const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: widthInt, height: heightInt })
            .toBuffer();
          res.set('Cache-Control', 'max-age=3600');
          res.set('Content-Type', 'image/jpeg');
          res.send(resizedImageBuffer);
        } else {
          res.set('Cache-Control', 'max-age=3600');
          res.set('Content-Type', 'image/jpeg');
          res.send(imageBuffer);
        }
      } catch (error) {
        throw new HttpException('Failed to fetch or resize file from URL', HttpStatus.BAD_REQUEST);
      }
    } else {
      const filePath = join(process.cwd(), 'uploads', 'thumbnails', decodedFileName);
      try {
        await fsPromises.access(filePath);

        if (widthInt || heightInt) {
          const fileStream = createReadStream(filePath);
          const transformStream = sharp()
            .resize({ width: widthInt, height: heightInt })
            .toFormat('jpeg');
          res.set('Cache-Control', 'max-age=3600');
          res.set('Content-Type', 'image/jpeg');
          fileStream.pipe(transformStream).pipe(res);
        } else {
          res.set('Cache-Control', 'max-age=3600');
          res.set('Content-Type', 'image/jpeg');
          createReadStream(filePath).pipe(res);
        }
      } catch (error) {
        return res.status(404).json({ message: 'File not found' });
      }
    }
  }

  async getContent(fileName: string, res: Response) {
    const decodedFileName = decodeURIComponent(fileName);
    if (isURL(decodedFileName, { require_protocol: true })) {
      try {
        this.logger.log(`Fetching file from URL: ${decodedFileName}`);
        const response = await axios.get(decodedFileName, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data);
        res.set('Cache-Control', 'max-age=3600');
        res.set('Content-Type', 'text/markdown');
        res.send(fileBuffer);
      } catch (error) {
        throw new HttpException('Failed to fetch file from URL', HttpStatus.BAD_REQUEST);
      }
    } else {
      const filePath = join(process.cwd(), 'uploads', 'contents', decodedFileName);
      try {
        await fsPromises.access(filePath);
        res.set('Cache-Control', 'max-age=3600');
        res.set('Content-Type', 'text/markdown');
        createReadStream(filePath).pipe(res);
      } catch (error) {
        return res.status(404).json({ message: 'File not found' });
      }
    }
  }

  async getAvatar(
    fileName: string,
    res: Response,
    width?: string | number,
    height?: string | number,
  ) {
    const decodedFileName = decodeURIComponent(fileName);
    let filePath = join(process.cwd(), 'uploads', 'avatars', decodedFileName);
    try {
      if (filePath == null) {
        return filePath = join(process.cwd(), 'uploads', 'avatars', 'default-avatar.jpg');
      }
      await fsPromises.access(filePath);
      const widthInt = width ? parseInt(width as string, 10) : 75;
      const heightInt = height ? parseInt(height as string, 10) : 75;
      const transformedImage = sharp(filePath)
        .resize({ width: widthInt, height: heightInt })
        .toFormat('png');
      res.set('Cache-Control', 'max-age=3600');
      res.set('Content-Type', 'image/png');
      transformedImage.pipe(res);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }
  }

  generateFileName(file: Express.Multer.File, prefix: string): string {
    const timestamp = Date.now();
    const extension = extname(file.originalname);
    return `${prefix}-${timestamp}${extension}`;
  }

  validateFileSize(file: Express.Multer.File, maxSize: number) {
    if (file.size > maxSize) {
      throw new BadRequestException(`File size should not exceed ${maxSize / 1024 / 1024}MB`);
    }
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileName = this.generateFileName(file, folder);
    const uploadPath = join(process.cwd(), 'uploads', folder, fileName);

    await fsPromises.writeFile(uploadPath, file.buffer);
    return fileName;
  }
  validateImageFile(file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }
  }

  async getImage(filename: string, res: Response) {
    try {
      const imagePath = join(process.cwd(), 'uploads', 'images', filename);
      if (!existsSync(imagePath)) {
        throw new NotFoundException('Image not found');
      }
      
      res.set('Cache-Control', 'max-age=3600');
      res.sendFile(imagePath);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

  async getProcessedMarkdown(fileName: string): Promise<string> {
    let markdownContent: string;
    
    try {
      if (isURL(fileName)) {
        try {
          const response = await axios.get(fileName);
          markdownContent = response.data;
        } catch (error) {
          throw new HttpException(
            `Failed to fetch markdown from URL: ${error.message}`,
            HttpStatus.BAD_REQUEST
          );
        }
      } else {
        const filePath = join(process.cwd(), 'uploads', 'contents', fileName);
        
        // Check if file exists
        if (!existsSync(filePath)) {
          throw new HttpException(
            `Markdown file not found: ${fileName}`,
            HttpStatus.NOT_FOUND
          );
        }
  
        try {
          markdownContent = await fsPromises.readFile(filePath, 'utf-8');
        } catch (error) {
          throw new HttpException(
            `Failed to read markdown file: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
  
      // Add logging
      console.log(`Processing markdown for: ${fileName}`);
      
      const processedContent = this.processMarkdownContent(markdownContent);
      if (!processedContent) {
        throw new HttpException(
          'Failed to process markdown content',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  
      return processedContent;
    } catch (error) {
      // Rethrow HttpExceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log unexpected errors
      console.error('Markdown processing error:', error);
      
      throw new HttpException(
        'Failed to process markdown file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private processMarkdownContent(content: string): string {
    const processedContent = content.replace(
      /!\[(.*?)\]\((?!https?:\/\/)([^\/\)]+)\)/g,
      (match, alt, imageName) => {
        return `![${alt}](${this.baseUrl}/api/uploads/image/${imageName})`;
      }
    );
    const md = new markdownIt({
      html: true,
      breaks: true,
      linkify: true
    });

    return md.render(processedContent);
  }
}
