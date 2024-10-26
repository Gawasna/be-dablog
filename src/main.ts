import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  console.log(join(__dirname, '../../uploads'))
  app.useStaticAssets(join(__dirname, '../../uploads'));
  await app.listen(3000);
}
bootstrap();
