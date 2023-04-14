import { BadRequestException, Injectable } from '@nestjs/common'
import { type User } from 'src/users/entity/user.entity'
import { UsersService } from 'src/users/users.service'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService
  ) {}

  async sendConfirmedEmail (user: User): Promise<void> {
    const { email, username } = user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to ft_transcendence! Email Confirmed',
      template: 'confirmed',
      context: {
        username,
        email
      }
    })
  }

  async sendConfirmationEmail (user: User): Promise<void> {
    user.authToken = Math.floor(10000 + Math.random() * 90000).toString()
    await this.usersService.save(user)
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to ft_transcendence! Confirm Email',
        template: 'confirm',
        context: {
          username: user.username,
          code: user.authToken
        }
      })
    } catch {
      throw new BadRequestException("Email doesnt't seem to be valid")
    }
    console.log(`email sent to ${user.email}`)
  }

  async verifyAccount (code: string): Promise<boolean> {
    const user = await this.usersService.findByCode(code)
    user.authToken = ''
    user.isVerified = true
    await this.usersService.save(user)
    await this.sendConfirmedEmail(user)
    console.log(code)
    return true
  }
}
