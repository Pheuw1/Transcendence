import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, type Profile, type VerifyCallback } from 'passport-42'
import { get } from 'https'
import { createWriteStream } from 'fs'

import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entity/user.entity'

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor (
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.get<string>('FT_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('FT_OAUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/log/inReturn',//configService.get<string>('FT_OAUTH_CALLBACK_URL'),
      passReqToCallback: true
    })
  }

  async validate (
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback
  ): Promise<VerifyCallback> {
    request.session.accessToken = accessToken
    const ftId = profile.id as number
    console.log('Validated ', profile.username)
    if ((await this.usersService.findUser(ftId)) === null) {
      const newUser = new User()
      newUser.ftId = profile.id as number
      newUser.username = profile.username
      newUser.avatar = `${ftId}.jpg`
      newUser.email = profile.emails[0].value
      void this.usersService.create(newUser)
      const file = createWriteStream(`avatars/${ftId}.jpg`)
      get(profile._json.image.versions.small, function (response) {
        response.pipe(file)
      })
    }
    return cb(null, profile)
  }
}
