import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const uploadsPath = join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsPath)) {
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log(`Directory created: ${uploadsPath}`);
    } catch (error) {
      console.error(`Failed to create directory: ${uploadsPath}`, error);
      return;
    }
  } else {
    console.log(`Directory already exists: ${uploadsPath}`);
  }
  app.useStaticAssets(uploadsPath);
  await app.listen(3000);
}
bootstrap();