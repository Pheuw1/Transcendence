import { IsString } from 'class-validator'
import { StringDto } from './StringDto'

export class StringDtoValidated extends StringDto {
  @IsString()
    value!: string
}
