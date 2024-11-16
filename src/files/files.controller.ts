import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('api/uploads')
export class FilesController {
    constructor (
        private readonly filesService: FilesService
    ) {}

    @Get('thumbnail/:fileName')
    async getThumbnail(
        @Param('fileName') fileName: string,
        @Res() res: Response,
        @Query('width') width?: string | number,
        @Query('height') height?: string | number, //not sure if this is nessary
    ) {
        return await this.filesService.getThumbnail(fileName, res, width, height);
    }

    // @Get('content/:fileName')
    // async getContent(
    //     @Param('fileName') fileName: string,
    //     @Res() res: Response,
    // ) {
    //     return await this.filesService.getContent(fileName, res);
    // }
}
