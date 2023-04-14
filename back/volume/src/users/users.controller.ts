import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  StreamableFile,
  BadRequestException,
  Redirect,
  Delete
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { type User } from './entity/user.entity'
import { UsersService } from './users.service'
import { UserDto, AvatarUploadDto } from './dto/user.dto'

import { AuthenticatedGuard } from 'src/auth/42-auth.guard'
import { Profile42 } from 'src/auth/42.decorator'
import { Profile } from 'passport-42'

import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { type Request, Response } from 'express'
import { createReadStream } from 'fs'
import { join } from 'path'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Get('blocked')
  @UseGuards(AuthenticatedGuard)
  async getBlockedUsers (@Profile42() profile: Profile): Promise<User[]> {
    const user = await this.usersService.getFullUser(+profile.id)
    if (user === null) throw new BadRequestException('User not found')
    user.socketKey = ''
    return user.blocked
  }

  @Get('block/:id')
  @UseGuards(AuthenticatedGuard)
  async blockUser (
    @Profile42() profile: Profile,
      @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    const user = await this.usersService.getFullUser(+profile.id)
    const target = await this.usersService.findUser(id)
    if (user === null || target === null) {
      throw new BadRequestException('User not found')
    }
    if (user.ftId === id) throw new BadRequestException('Cannot block yourself')
    user.blocked.push(target)
    console.log('user', JSON.stringify(user))
    console.log('user', JSON.stringify(target))
    await this.usersService.save(user)
  }

  @Delete('block/:id')
  @UseGuards(AuthenticatedGuard)
  async unblockUser (
    @Profile42() profile: Profile,
      @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    const user = await this.usersService.getFullUser(+profile.id)
    if (user === null) throw new BadRequestException('User not found')
    const lenBefore = user.blocked.length
    user.blocked = user.blocked.filter((usr: User) => {
      return usr.ftId !== id
    })
    if (lenBefore === user.blocked.length) throw new BadRequestException('User not found')
    await this.usersService.save(user)
  }

  @Get('all')
  async getAllUsers (): Promise<User[]> {
    return await this.usersService.findUsers()
  }

  @Get('online')
  async getOnlineUsers (): Promise<User[]> {
    return await this.usersService.findOnlineUsers()
  }

  @Get('friends')
  @UseGuards(AuthenticatedGuard)
  async getFriends (@Profile42() profile: Profile): Promise<User[]> {
    return await this.usersService.getFriends(+profile.id)
  }

  @Get('invits')
  @UseGuards(AuthenticatedGuard)
  async getInvits (@Profile42() profile: Profile): Promise<User[]> {
    return await this.usersService.getInvits(+profile.id)
  }

  @Get('leaderboard')
  @UseGuards(AuthenticatedGuard)
  async getLeaderboard (): Promise<User[]> {
    return await this.usersService.getLeaderboard()
  }

  @Post('avatar')
  @UseGuards(AuthenticatedGuard)
  @Redirect(`http://${process.env.HOST ?? 'localhost'}`)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'avatars/'
      }),
      fileFilter: (request: Request, file: Express.Multer.File, callback) => {
        if (!file.mimetype.includes('image')) {
          callback(null, false)
          return
        }
        callback(null, true)
      }
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: AvatarUploadDto
  })
  async changeAvatar (
    @Profile42() profile: Profile,
      @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    if (file === undefined) return
    await this.usersService.addAvatar(+profile.id, file.filename)
  }

  @Get('avatar')
  @UseGuards(AuthenticatedGuard)
  async getAvatar (
    @Profile42() profile: Profile,
      @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    return await this.getAvatarById(+profile.id, response)
  }

  @Get(':name/byname')
  async getUserByName (@Param('name') username: string): Promise<User> {
    const user = await this.usersService.findUserByName(username)
    user.socketKey = ''
    return user
  }

  @Get('invit/:username')
  @UseGuards(AuthenticatedGuard)
  async invitUser (
    @Profile42() profile: Profile,
      @Param('username') username: string
  ): Promise<void> {
    const target: User | null = await this.usersService.findUserByName(
      username
    )
    if (target === null) {
      throw new BadRequestException(`User ${username} not found.`)
    }
    if (+profile.id === +target.ftId) {
      throw new BadRequestException("You can't invite yourself.")
    }
    const ret: string = await this.usersService.invit(+profile.id, target.ftId)
    if (ret !== 'OK') throw new BadRequestException(ret)
  }

  @Get(':id/avatar')
  async getAvatarById (
    @Param('id', ParseIntPipe) ftId: number,
      @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const user: User | null = await this.usersService.findUser(ftId)
    if (user === null) throw new BadRequestException('User unknown.')
    const filename = user.avatar
    const stream = createReadStream(join(process.cwd(), 'avatars/' + filename))
    response.set({
      'Content-Diposition': `inline; filename='${filename}'`,
      'Content-Type': 'image/jpg'
    })
    return new StreamableFile(stream)
  }

  @Get(':id')
  async getUserById (
    @Param('id', ParseIntPipe) ftId: number
  ): Promise<User | null> {
    const user = await this.usersService.findUser(ftId)
    if (user == null) throw new BadRequestException('User unknown.')
    user.socketKey = ''
    return user
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  async getUser (@Profile42() profile: Profile): Promise<User | null> {
    return await this.usersService.findUser(profile.id)
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  async updateUser (
    @Body() payload: UserDto,
      @Profile42() profile: Profile
  ): Promise<User> {
    const user = await this.usersService.findUser(profile.id)
    if (user == null) throw new BadRequestException('User not found.')
    await this.usersService.update(user, payload)
    return user
  }
}
