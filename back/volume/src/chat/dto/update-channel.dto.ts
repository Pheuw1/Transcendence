import { PartialType } from '@nestjs/mapped-types'
import { CreateChannelDto } from './create-channel.dto'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id: number
  @IsOptional()
  @IsNumber()
    users: [number]

  @IsOptional()
  @IsNumber()
    messages: [number]

  @IsOptional()
  @IsNumber()
    owners: [number] // user id

  @IsOptional()
  @IsNumber()
    banned: [number] // user id

  @IsOptional()
  @IsNumber()
    muted: [number] // user id

  @IsString()
  @IsOptional()
    password: string
}
