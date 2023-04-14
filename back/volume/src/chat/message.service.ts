import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatService } from './chat.service'
import { UsersService } from 'src/users/users.service'

import { type CreateMessageDto } from './dto/create-message.dto'
import type User from 'src/users/entity/user.entity'
import type Channel from './entity/channel.entity'
import Message from './entity/message.entity'

@Injectable()
export class MessageService {
  constructor (
    @InjectRepository(Message)
    private readonly MessageRepository: Repository<Message>,
    private readonly channelService: ChatService,
    private readonly usersService: UsersService
  ) {}

  async createMessage (message: CreateMessageDto): Promise<Message> {
    const msg = new Message()
    msg.text = message.text
    msg.channel = await this.channelService.getChannel(message.ChannelId)
    msg.author = (await this.usersService.findUser(message.UserId)) as User
    msg.author.socketKey = ''
    return await this.MessageRepository.save(msg)
  }

  async findMessagesInChannelForUser (
    channel: Channel,
    user: User
  ): Promise<Message[]> {
    const blockeds = user.blocked.map((u) => +u.ftId)
    const messages = await this.MessageRepository.createQueryBuilder('message')
      .innerJoin('message.channel', 'channel')
      .where('channel.id = :chanId', { chanId: channel.id })
      .leftJoinAndSelect('message.author', 'author')
      .orderBy('message.created_at', 'ASC')
      .getMany()
    messages.forEach((msg) => {
      msg.author.socketKey = ''
    })
    return messages.filter((m) => !blockeds.includes(m.author.ftId))
  }
}
