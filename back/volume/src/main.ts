import { InternalServerErrorException, Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as passport from 'passport'
import { type NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { IoAdapter } from '@nestjs/platform-socket.io'

async function bootstrap (): Promise<void> {
  const logger = new Logger()
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const port =
    process.env.BACK_PORT !== undefined && process.env.BACK_PORT !== ''
      ? +process.env.BACK_PORT
      : 3001
  const cors = {
    origin: new RegExp(
      `^(http|ws)://${process.env.HOST ?? 'localhost'}(:\\d+)?$`
    ),
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders:
     ['Accept', 'Content-Type', 'Authorization']
  }
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret:
        process.env.JWT_SECRET !== undefined && process.env.JWT_SECRET !== ''
          ? process.env.JWT_SECRET
          : 'secret'
    })
  )
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.enableCors(cors)
  app.useWebSocketAdapter(new IoAdapter(app))
  await app.listen(port)
  logger.log(`Application listening on port ${port}`)
}
bootstrap().catch((e) => {
  throw new InternalServerErrorException(e)
})
