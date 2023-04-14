import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type Profile } from 'passport-42'

export const Profile42 = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Profile => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)
