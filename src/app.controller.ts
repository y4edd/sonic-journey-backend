import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '気さくな挨拶を行う' })
  @ApiResponse({ status: 200, description: 'Success' })
  getHello(): string {
    return this.appService.getHello();
  }
}
