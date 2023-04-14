import { forwardRef, Module } from '@nestjs/common'
import { PongGateway } from './pong.gateway'
import Result from './entity/result.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PongService } from './pong.service'
import { UsersModule } from 'src/users/users.module'
import { PongController } from './pong.controller'

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Result])],
  providers: [PongGateway, PongService],
  controllers: [PongController],
  exports: [PongService]
})
export class PongModule {}
