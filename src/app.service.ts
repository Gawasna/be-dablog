import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, createReadStream, readFileSync, promises as fsPromises } from 'fs';
import axios from 'axios';
import * as sharp from 'sharp';
import { isURL } from 'validator';
import * as markdownIt from 'markdown-it';

@Injectable()
export class AppService {
  async getFilebyFileName(
    fileName: string,
    res: Response,
    width?: string | number,
    height?: string | number,
  ) {
    const decodedFileName = decodeURIComponent(fileName);

    // Ép kiểu width và height về dạng số nguyên nếu chúng là chuỗi
    const widthInt = width ? parseInt(width as string, 10) : undefined;
    const heightInt = height ? parseInt(height as string, 10) : undefined;

    // Kiểm tra nếu decodedFileName là URL
    if (isURL(decodedFileName, { require_protocol: true })) {
      try {
        const response = await axios.get(decodedFileName, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        if (widthInt || heightInt) {
          // Resize nếu có width hoặc height
          const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: widthInt, height: heightInt })
            .toBuffer();
          res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
          res.set('Content-Type', 'image/jpeg');
          res.send(resizedImageBuffer);
        } else {
          // Gửi ảnh gốc nếu không có width và height
          res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
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
          // Resize nếu có width hoặc height
          const fileStream = createReadStream(filePath);
          const transformStream = sharp()
            .resize({ width: widthInt, height: heightInt })
            .toFormat('jpeg');
          res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
          res.set('Content-Type', 'image/jpeg');
          fileStream.pipe(transformStream).pipe(res);
        } else {
          // Gửi ảnh gốc nếu không có width và height
          res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
          res.set('Content-Type', 'image/jpeg');
          createReadStream(filePath).pipe(res);
        }
      } catch (error) {
        return res.status(404).json({ message: 'File not found' });
      }
    }
  }

  async getMarkdownFile(
    fileName: string,
    res: Response,
  ) {
    const decodedFileName = decodeURIComponent(fileName);

    // Kiểm tra nếu decodedFileName là URL
    if (isURL(decodedFileName, { require_protocol: true })) {
      try {
        const response = await axios.get(decodedFileName);
        const markdownContent = response.data;

        // Chuyển markdown thành HTML (nếu cần)
        const md = new markdownIt();
        const htmlContent = md.render(markdownContent);
        res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
        res.set('Content-Type', 'text/html');
        res.send(htmlContent); // Trả về dưới dạng HTML nếu bạn muốn render markdown trực tiếp
      } catch (error) {
        throw new HttpException('Failed to fetch markdown file from URL', HttpStatus.BAD_REQUEST);
      }
    } else {
      const filePath = join(process.cwd(), 'uploads', 'content', decodedFileName);
      if (!existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }

      try {
        // Đọc nội dung markdown từ file
        const markdownContent = readFileSync(filePath, 'utf-8');

        // Chuyển markdown thành HTML (nếu cần)
        const md = new markdownIt();
        const htmlContent = md.render(markdownContent);
        res.set('Cache-Control', 'max-age=3600'); // Lưu trữ cache trong 1 giờ
        res.set('Content-Type', 'text/html');
        res.send(htmlContent); // Trả về dưới dạng HTML
      } catch (error) {
        throw new HttpException('Failed to read markdown file', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}