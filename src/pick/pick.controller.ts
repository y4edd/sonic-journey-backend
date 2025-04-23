import { Controller, Get, Param } from '@nestjs/common';
import { PickService } from './pick.service';

@Controller('pick')
export class PickController {
  constructor(private readonly pickService: PickService) {}

  @Get()
  async getPick() {
    return this.pickService.getPick();
  }

  @Get(':id')
  async getPickSong(@Param('id') id: number) {
    return this.pickService.getPickSong(id);
  }
}
