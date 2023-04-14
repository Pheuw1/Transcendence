declare module 'passport-42' {
  export type Profile = any
  export type VerifyCallback = any
  export class Strategy {
    constructor (options: any, verify: any)
    authenticate (req: any, options: any): any
  }
}
