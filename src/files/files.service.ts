import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, createReadStream, promises as fsPromises, access } from 'fs';
import axios from 'axios';
import * as sharp from 'sharp';
import { isURL } from 'validator';

@Injectable()
export class FilesService {

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
}
