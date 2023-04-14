import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator'

export class IdDto {
  @IsNumber()
    id: number
}

export class PasswordDto {
  @IsString()
    password: string
}

export class CodeDto {
  @IsNumberString()
    code: string
}

export class MuteDto {
  data: number[]
}

export class EmailDto {
  @IsEmail()
    email: string
}
