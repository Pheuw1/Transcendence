import { IsString, IsNotEmpty, IsPositive, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'

export class UserDto {
  @IsPositive()
  @IsOptional()
  readonly ftId: number

  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsOptional()
  readonly status: string

  @IsOptional()
  readonly avatar: string

  @IsOptional()
  readonly authToken: string

  @IsOptional()
  readonly isVerified: boolean
}

export class AvatarUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File
}
