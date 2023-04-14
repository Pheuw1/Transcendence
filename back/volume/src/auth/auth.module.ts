import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { FtStrategy } from './42.strategy'
import { SessionSerializer } from './session.serializer'
import { JwtModule } from '@nestjs/jwt'
import { MailerModule } from '@nestjs-modules/mailer'
import { AuthService } from './auth.service'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

const mailUser =
  process.env.MAIL_USER !== null && process.env.MAIL_USER !== ''
    ? process.env.MAIL_USER
    : ''
const mailPass =
  process.env.MAIL_PASSWORD !== null && process.env.MAIL_PASSWORD !== ''
    ? process.env.MAIL_PASSWORD
    : ''

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPass
        }
      },
      template: {
        dir: 'src/auth/mails',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      },
      defaults: {
        from: '"No Reply" vaganiwast@gmail.com'
      }
    })
  ],
  providers: [ConfigService, FtStrategy, SessionSerializer, AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
