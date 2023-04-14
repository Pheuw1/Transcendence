import {
  Controller,
  Get,
  Redirect,
  UseGuards,
  Res,
  Req,
  Post,
  Body,
  BadRequestException,
  Header
} from '@nestjs/common'
import { Response, Request } from 'express'

import { FtOauthGuard, AuthenticatedGuard } from './42-auth.guard'
import { Profile } from 'passport-42'
import { Profile42 } from './42.decorator'

import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service'
import { CodeDto, EmailDto } from 'src/chat/dto/updateUser.dto'
import type User from 'src/users/entity/user.entity'

const frontHost =
  process.env.HOST !== undefined && process.env.HOST !== ''
    ? process.env.HOST
    : 'localhost'
const frontPort =
  process.env.PORT !== undefined && process.env.HOST !== ''
    ? process.env.PORT
    : '80'

@Controller('log')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('/email')
  @UseGuards(AuthenticatedGuard)
  async setEmail (
    @Profile42() profile: Profile,
      @Body() body: EmailDto
  ): Promise<void> {
    console.log(profile.email)
    const email = body.email
    const user = await this.usersService.getFullUser(+profile.id)
    console.log(`email sent to ${user.email}`)
    user.email = email
    await this.usersService.save(user)
  }

  @Get('in')
  @UseGuards(FtOauthGuard)
  ftAuth (): void {}

  @Get('inReturn')
  @UseGuards(FtOauthGuard)
  @Redirect(`http://${frontHost}:${frontPort}`)
  ftAuthCallback (
    @Res({ passthrough: true }) response: Response,
      @Req() request: Request
  ): any {
    console.log('cookie:', request.cookies['connect.sid'])
    response.cookie('connect.sid', request.cookies['connect.sid'])
  }

  @Get('/verify')
  @UseGuards(AuthenticatedGuard)
  async VerifyEmail (@Profile42() profile: Profile): Promise<void> {
    const ftId: number = profile.id
    const user = await this.usersService.findUser(ftId)
    if (user == null) throw new BadRequestException('User not found')
    await this.authService.sendConfirmationEmail(user)
  }

  @Post('/verify')
  @UseGuards(AuthenticatedGuard)
  async Verify (
    @Profile42() profile: Profile,
      @Body() body: CodeDto
  ): Promise<void> {
    console.log(body, body.code)
    const user = await this.usersService.getFullUser(+profile.id)
    if (user.authToken !== body.code) {
      throw new BadRequestException(
        "Code doesn't seem valid\nPlease try again"
      )
    }
    console.log("how", body, body.code)
    user.isVerified = true
    await this.usersService.save(user)
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  profile (@Profile42() user: Profile): any {
    return { user }
  }

  @Get('out')
  @Redirect(`http://${frontHost}:${frontPort}`)
  logOut (@Req() req: Request): any {
    req.logOut(function (err) {
      if (err != null) return err
    })
  }
}
