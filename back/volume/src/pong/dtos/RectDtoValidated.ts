import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { Rect } from '../game/utils'
import { PointDtoValidated } from './PointDtoValidated'

export class RectDtoValidated extends Rect {
  @ValidateNested()
  @Type(() => PointDtoValidated)
    center!: PointDtoValidated

  @ValidateNested()
  @Type(() => PointDtoValidated)
    size!: PointDtoValidated
}
