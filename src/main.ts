import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';
import * as express from 'express';

const dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const uploadDirs = ['uploads', 'uploads/thumbnails', 'uploads/content', 'uploads/avatars'];
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(join(__dirname, '..', dir))) {
        fs.mkdirSync(join(__dirname, '..', dir), { recursive: true });
        console.log('Directory created: ', dir);
      }
  });
  app.use('/images', express.static(join(__dirname, '..', 'uploads', 'thumbnails')));
  app.use('/markdown', express.static(join(__dirname, '..', 'uploads', 'content')));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads' , '..')));
  const srPath = express.static(join(__dirname, '..', 'uploads', '..'));
  app.use(srPath);

  await app.listen(3000).then(() => {
    console.log('Server is running on: http://localhost:3000');
    console.log('Require connection to MariaDB : ', process.env.DB_NAME);
    console.log('Using static assets :'
      , join(__dirname, '..', 'uploads', 'thumbnails')
      , join(__dirname, '..', 'uploads', 'content')
      , join(__dirname, '..', 'uploads', 'avatars')
    );
    console.log('using user:', process.env.DB_USERNAME);
    console.log('SMTP user: ', process.env.GOOGLE_MAIL_CLIENT);
    console.log('SMTP pass: ', process.env.GOOGLE_MAIL_KEY);
  });
}
bootstrap();