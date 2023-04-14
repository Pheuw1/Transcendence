import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ConnectionDto {
  @IsNumber()
    UserId: number

  @IsNumber()
    ChannelId: number

  @IsString()
  @IsOptional()
    pwd: string
}
