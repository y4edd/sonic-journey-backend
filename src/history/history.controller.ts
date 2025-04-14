import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryDTO } from './dto/history.dto';
import { AuthGuard } from 'src/auth/guards/cookie-auth.guard';
import {
  RequestWithAuthorizationHeader,
  RequestWithCookies,
} from 'src/auth/interfaces/auth.interface';
import { HeaderAuthGuard } from 'src/auth/guards/header-auth.guard';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async postHistory(
    @Req() request: RequestWithCookies,
    @Body() dto: HistoryDTO,
  ) {
    return this.historyService.postHistory(request, dto);
  }

  @UseGuards(HeaderAuthGuard)
  @Delete()
  async deleteHistory(@Req() request: RequestWithAuthorizationHeader) {
    return this.historyService.deleteHistory(request);
  }

  @UseGuards(HeaderAuthGuard)
  @Get()
  async getHistory(
    @Req() request: RequestWithAuthorizationHeader,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.historyService.getHistory(request, limit);
  }
}
