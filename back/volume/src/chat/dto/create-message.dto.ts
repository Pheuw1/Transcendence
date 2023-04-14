import { IsNumber, IsString } from 'class-validator'

export class CreateMessageDto {
  @IsString()
    text: string

  @IsNumber()
    UserId: number

  @IsNumber()
    ChannelId: number
}
