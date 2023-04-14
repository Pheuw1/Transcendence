import { IsNumber } from 'class-validator'

export class kickUserDto {
  @IsNumber()
    chan: number

  @IsNumber()
    from: number

  @IsNumber()
    to: number
}
