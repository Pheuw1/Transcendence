import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PongModule } from 'src/pong/pong.module'

@Module({
  imports: [forwardRef(() => PongModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
