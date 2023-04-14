import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { type Profile } from 'passport-42'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser (
    user: Profile,
    done: (err: Error | null, user: Profile) => void
  ): any {
    done(null, user)
  }

  deserializeUser (
    payload: Profile,
    done: (err: Error | null, user: Profile) => void
  ): any {
    done(null, payload)
  }
}
