import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryDTO } from './dto/history.dto';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async postHistory(
    @Req() request: RequestWithCookies,
    @Body() dto: HistoryDTO,
  ) {
    return this.historyService.postHistory(request, dto);
  }

  @Delete()
  async deleteHistory(@Req() request: RequestWithCookies) {
    return this.historyService.deleteHistory(request);
  }

  @Get()
  async getHistory(
    @Req() request: RequestWithCookies,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.historyService.getHistory(request, limit);
  }
}
