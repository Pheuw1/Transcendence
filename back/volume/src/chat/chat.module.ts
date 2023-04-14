import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { ChatGateway } from './chat.gateway'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { MessageService } from './message.service'

import Channel from './entity/channel.entity'
import Message from './entity/message.entity'
import ConnectedUser from './entity/connection.entity'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([Channel, Message, ConnectedUser])
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, MessageService],
  exports: [ChatService]
})
export class ChatModule {}
