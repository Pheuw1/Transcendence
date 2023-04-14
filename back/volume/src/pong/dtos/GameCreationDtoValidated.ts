import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator'
import {
  DEFAULT_BALL_INITIAL_SPEED,
  DEFAULT_MAX_BALL_SPEED
} from '../game/constants'
import { MapDtoValidated } from './MapDtoValidated'

export class GameCreationDtoValidated {
  @IsString({ each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
    playerNames!: string[]

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MapDtoValidated)
    map!: MapDtoValidated

  @IsNumber()
  @Min(DEFAULT_BALL_INITIAL_SPEED.x)
  @Max(DEFAULT_MAX_BALL_SPEED.x)
    initialBallSpeedX!: number

  @IsNumber()
  @Min(DEFAULT_BALL_INITIAL_SPEED.y)
  @Max(DEFAULT_MAX_BALL_SPEED.y)
    initialBallSpeedY!: number
}
