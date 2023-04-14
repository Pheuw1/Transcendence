import { IsBoolean } from 'class-validator'
import { MatchmakingDto } from './MatchmakingDto'

export class MatchmakingDtoValidated extends MatchmakingDto {
  @IsBoolean()
    matchmaking!: boolean
}
