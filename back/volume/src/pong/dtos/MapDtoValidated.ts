import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsObject,
  ValidateNested
} from 'class-validator'
import { PointDtoValidated } from './PointDtoValidated'
import { RectDtoValidated } from './RectDtoValidated'

export class MapDtoValidated {
  @IsObject()
  @IsDefined()
  @Type(() => PointDtoValidated)
    size!: PointDtoValidated

  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => RectDtoValidated)
    walls!: RectDtoValidated[]
}
