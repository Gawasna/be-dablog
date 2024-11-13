import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('file/:fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
    @Query('width') width?: number,
    @Query('height') height?: number,
  ) {
    return await this.appService.getFilebyFileName(fileName, res, width, height);
  }

  @Get('file/markdown/:fileName')
  getMarkdownFile(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.appService.getMarkdownFile(fileName, res);
  }
}
