import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor (
        private readonly filesService: FilesService
    ) {}

    // @Get('/:thumbnail')
    // getThumb(@Param('thumbnail') thumbnail: string, @Res() res: Response) {
    //     return this.filesService.getThumbnail(thumbnail, res);
    // }
    
    // @Get(':/content')
    // getContent(@Param('content') content: string, @Res() res: Response) {
    //     return this.filesService.getContent(content, res);
    // }

}
