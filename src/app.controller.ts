import { Controller, Get } from '@nestjs/common';

@Controller('data')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @Get()
  getData() {
    return { message: 'Hello from NestJS backend!', data: [1, 2, 3, 4, 5] };
  }
}

