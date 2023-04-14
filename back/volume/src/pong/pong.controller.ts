import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { Paginate, type Paginated, PaginateQuery } from 'nestjs-paginate'
import { AuthenticatedGuard } from 'src/auth/42-auth.guard'
import type Result from './entity/result.entity'
import { PongService } from './pong.service'

@Controller('results')
export class PongController {
  constructor (private readonly pongService: PongService) {}

  @Get('global')
  @UseGuards(AuthenticatedGuard)
  async getGlobalHistory (
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<Result>> {
    return await this.pongService.getHistory(query, 0)
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  async getHistoryById (
    @Param('id', ParseIntPipe) id: number,
      @Paginate() query: PaginateQuery
  ): Promise<Paginated<Result>> {
    return await this.pongService.getHistory(query, id)
  }
}
