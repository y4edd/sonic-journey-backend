import { Controller, Get, Param } from '@nestjs/common';
import { PickService } from './pick.service';

@Controller('pick')
export class PickController {
  constructor(private readonly pickService: PickService) {}

  @Get()
  async getPick() {
    console.log('pickにGETリクエスト送信');
    return this.pickService.getPick();
  }

  @Get(':id')
  async getPickSong(@Param('id') id: number) {
    console.log('pickのIDを取得', id);
    return this.pickService.getPickSong(id);
  }
}
