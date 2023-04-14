import {
  type ExecutionContext,
  Injectable,
  type CanActivate
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { type Request } from 'express'

@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
  async canActivate (context: ExecutionContext): Promise<boolean> {
    const activate: boolean = (await super.canActivate(context)) as boolean
    const request: Request = context.switchToHttp().getRequest()
    await super.logIn(request)
    return activate
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate (context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()
    return req.isAuthenticated()
  }
}
