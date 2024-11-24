import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('api/uploads')
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) { }

    @Get('thumbnail/:fileName')
    async getThumbnail(
        @Param('fileName') fileName: string,
        @Res() res: Response,
        @Query('width') width?: string | number,
        @Query('height') height?: string | number, 
    ) {
        return await this.filesService.getThumbnail(fileName, res, width, height);
    }

    @Get('image/:filename')
    async getImage(
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        return this.filesService.getImage(filename, res);
    }

    @Get('content/:fileName')
    async getMarkdown(
        @Param('fileName') fileName: string,
        @Res() res: Response
    ) {
        try {
            const htmlContent = await this.filesService.getProcessedMarkdown(fileName);
            res.set('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            throw new HttpException(
                'Failed to process markdown',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
