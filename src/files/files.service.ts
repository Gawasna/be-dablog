import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class FilesService {
    // async getThumbnail(thumbnail: string, res: Response) {
    //     if (thumbnail.startsWith('http')) {
    //         return res.redirect(thumbnail);
    //     }
    //     const path = `./uploads/thumbnails/${thumbnail}`;
    //     res.sendFile(path, { root: '.' }, (err) => {
    //         if (err) {
    //             res.status(404).send('Thumbnail not found');
    //         }
    //     });
    // }

    // async getContent(content: string, res: Response) {
    //     if (content.startsWith('http')) {
    //         return res.redirect(content);
    //     }
    //     const path = `./uploads/content/${content}`;
    //     res.sendFile(path, { root: '.' }, (err) => {
    //         if (err) {
    //             res.status(404).send('Content not found');
    //         }
    //     });
    // }
}
