import { IsNumber } from 'class-validator'
import { Point } from '../game/utils'

export class PointDtoValidated extends Point {
  @IsNumber()
    x!: number

  @IsNumber()
    y!: number
}
