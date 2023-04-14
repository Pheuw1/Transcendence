import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from '@nestjs/common'
import { AuthenticatedGuard } from 'src/auth/42-auth.guard'
import { UsersService } from 'src/users/users.service'
import { ChatService } from './chat.service'

import { CreateChannelDto } from './dto/create-channel.dto'
import { IdDto, PasswordDto, MuteDto } from './dto/updateUser.dto'

import type User from 'src/users/entity/user.entity'
import type Channel from './entity/channel.entity'
import { Profile42 } from 'src/auth/42.decorator'
import { Profile } from 'passport-42'
import { IsNumberString, IsPositive } from 'class-validator'

@Controller('channels')
@UseGuards(AuthenticatedGuard)
export class ChatController {
  constructor (
    private readonly channelService: ChatService,
    private readonly usersService: UsersService
  ) {}

  @Get('dms/:otherName')
  async getDMsForUser (
    @Profile42() profile: Profile,
      @Param('otherName') otherName: string
  ): Promise<Channel[]> {
    const user = await this.usersService.findUser(+profile.id)
    const other = await this.usersService.findUserByName(otherName)
    const channels = await this.channelService.getChannelsForUser(+profile.id)

    if (user === null || other === null) {
      throw new BadRequestException('User not found')
    }
    const dms = channels.filter((channel: Channel) => {
      return (
        (channel.name === `${user.ftId}&${other.ftId}` ||
          channel.name === `${other.ftId}&${user.ftId}`)
      )
    })
    if (dms.length === 0) {
      throw new BadRequestException('No DMS found')
    }
    return dms
  }

  @Post(':id/invite')
  async addUser (
    @Param('id', ParseIntPipe) id: number,
      @Body() target: IdDto,
      @Profile42() profile: Profile
  ): Promise<void> {
    const channel = await this.channelService.getFullChannel(id)
    const user: User | null = await this.usersService.getFullUser(target.id)
    if (user == null || target === undefined) {
      throw new NotFoundException(`User #${target.id} not found`)
    }
    if (!(await this.channelService.isUser(channel.id, +profile.id))) {
      throw new BadRequestException(
        'You are not allowed to invite users to this channel'
      )
    }
    if (await this.channelService.isUser(channel.id, target.id)) {
      throw new BadRequestException('User is already in this channel')
    }
    if (await this.channelService.isBanned(channel.id, target.id)) {
      throw new BadRequestException('User is banned from this channel')
    }
    channel.users.push(user)
    await this.channelService.save(channel)
  }

  @Get(':id/users')
  async getUsersOfChannel (
    @Param('id', ParseIntPipe) id: number
  ): Promise<User[]> {
    const users = (await this.channelService.getFullChannel(id)).users
    users.forEach((u) => (u.socketKey = ''))
    return users
  }

  @Post(':id/admin')
  async addAdmin (
    @Param('id', ParseIntPipe) id: number,
      @Body() target: IdDto,
      @Profile42() profile: Profile
  ): Promise<void> {
    const channel = await this.channelService.getFullChannel(id)
    const user: User | null = await this.usersService.findUser(target.id)
    if (user == null) {
      throw new NotFoundException(`User #${target.id} not found`)
    }
    if (!(await this.channelService.isOwner(channel.id, +profile.id))) {
      throw new BadRequestException('You are not the owner of this channel')
    }
    if (!(await this.channelService.isUser(channel.id, target.id))) {
      throw new BadRequestException('User is not in this channel')
    }
    if (await this.channelService.isAdmin(channel.id, target.id)) {
      throw new BadRequestException('User is already an admin of this channel')
    }
    channel.admins.push(user)
    await this.channelService.save(channel)
  }

  @Delete(':id/admin')
  async removeAdmin (
    @Param('id', ParseIntPipe) id: number,
      @Body() target: IdDto,
      @Profile42() profile: Profile
  ): Promise<void> {
    const channel = await this.channelService.getFullChannel(id)
    if (!(await this.channelService.isOwner(channel.id, +profile.id))) {
      throw new BadRequestException('You are not the owner of this channel')
    }
    if (!(await this.channelService.isAdmin(channel.id, target.id))) {
      throw new BadRequestException('User is not an admin of this channel')
    }
    channel.admins = channel.admins.filter((usr: User) => {
      return usr.ftId !== target.id
    })
    await this.channelService.save(channel)
  }

  @Post(':id/ban')
  async addBan (
    @Param('id', ParseIntPipe) id: number,
      @Body() target: MuteDto,
      @Profile42() profile: Profile
  ): Promise<void> {
    const channel = await this.channelService.getFullChannel(id)
    const user: User | null = await this.usersService.findUser(+target.data[0])
    if (isNaN(+target.data[1])) {
      throw new BadRequestException(`Invalid duration ${target.data[1]}`)
    }
    if (user == null) {
      throw new NotFoundException(`User #${+target.data[0]} not found`)
    }
    if (!(await this.channelService.isAdmin(channel.id, +profile.id))) {
      throw new BadRequestException(
        'You are not allowed to ban users from this channel'
      )
    }
    if (await this.channelService.isOwner(channel.id, +target.data[0])) {
      throw new BadRequestException('You cannot ban the owner of the channel')
    }
    if (await this.channelService.isBanned(channel.id, +target.data[0])) {
      throw new BadRequestException('User is already banned from this channel')
    }
    channel.banned.push([+target.data[0], Date.now() + +target.data[1] * 1000])
    await this.channelService.save(channel)
  }

  @Post(':id/mute')
  async addMute (
    @Param('id', ParseIntPipe) id: number,
      @Body() mute: MuteDto, // [userId, duration]
      @Profile42() profile: Profile
  ): Promise<void> {
    const channel = await this.channelService.getFullChannel(id)
    const user: User | null = await this.usersService.findUser(+mute.data[0])
    if (isNaN(+mute.data[1])) {
      throw new BadRequestException(`Invalid duration ${+mute.data[1]}`)
    }
    if (user == null) {
      throw new NotFoundException(`User #${+mute.data[0]} not found`)
    }
    if (!(await this.channelService.isAdmin(channel.id, +profile.id))) {
      throw new BadRequestException(
        'You are not allowed to mute users from this channel'
      )
    }
    if (await this.channelService.isOwner(channel.id, +mute.data[0])) {
      throw new BadRequestException('You cannot mute the owner of the channel')
    }
    if (await this.channelService.isMuted(channel.id, +mute.data[0])) {
      throw new BadRequestException('User is already muted from this channel')
    }
    const newMute: number[] = [+mute.data[0], Date.now() + +mute.data[1] * 1000]
    channel.muted.push(newMute)
    await this.channelService.save(channel)
  }

  @Delete(':id')
  async deleteChannel (
    @Profile42() profile: Profile,
      @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    if (!(await this.channelService.isOwner(id, +profile.id))) {
      throw new BadRequestException('You are not the owner of this channel')
    }
    await this.channelService.removeChannel(id)
  }

  @Post(':id/password')
  async updatePassword (
    @Profile42() profile: Profile,
      @Param('id', ParseIntPipe) id: number,
      @Body() data: PasswordDto
  ): Promise<void> {
    if (!(await this.channelService.isOwner(id, +profile.id))) {
      throw new BadRequestException('You are not the owner of this channel')
    }
    let channel = (await this.channelService.getChannel(id)) as Channel
    if (channel.isDM) throw new BadRequestException('You cannot set a password on a DM channel')
    channel.password = await this.channelService.hash(data.password)
    this.channelService.update(channel)
  }

  @Get()
  async getChannelsForUser (@Profile42() profile: Profile): Promise<Channel[]> {
    console.log(profile.emails[0].value)
    console.log(profile)
    const chan = await this.channelService.getChannelsForUser(+profile.id)
    return chan
  }

  @Post()
  async createChannel (@Body() channel: CreateChannelDto): Promise<Channel> {
    const chan = await this.channelService.createChannel(channel)
    chan.users.forEach((u) => (u.socketKey = ''))
    chan.admins.forEach((u) => (u.socketKey = ''))
    chan.owner.socketKey = ''
    return chan
  }
}
