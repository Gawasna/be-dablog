import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class TestController {
  @Get('test')
  getTest(): string {
    return 'Connection successful';
  }
}
