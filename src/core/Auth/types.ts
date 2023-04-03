import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export enum UserLevel {
  Trainee = 'Trainee',
  Junior = 'Junior',
  Middle = 'Middle',
  Senior = 'Senior',
  TechArchitector = 'Tech architector',
}

@Schema()
export class TUserRegistration {
  @ApiProperty({ example: 'dev.test@test.com', type: 'string' })
  @IsEmail({}, { message: 'Email is not a valid email.' })
  @Prop({ required: true })
  email: string

  @ApiProperty({ example: 'Peter', type: 'string' })
  @IsString({ message: 'Username is not a string' })
  @Prop({ required: true })
  @Length(3, 20, {
    message: 'Username should be longer than 2 symbols and shorter than 21',
  })
  username: string

  @ApiProperty({ type: 'string', example: 'passwordtest' })
  @IsString({ message: 'Password should be a string.' })
  @Prop({ required: true })
  @Length(7, 21, {
    message: 'Password should be longer than 6 symbols and shorter than 22',
  })
  password: string
}

export class TLoginData {
  @ApiProperty({ example: 'example@example.com', type: 'string' })
  email: string

  @ApiProperty({ type: 'string' })
  password: string
}

export class TAuthResponseData {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzcyNjc4NDcsImV4cCI6MTY3NzI2OTA0N30.jak0XNbOfp6nNVbaOQONM9aoH9mJ2LlNpDHh3n_1_oY',
    type: 'string',
  })
  access_token: string

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzcyNjc4NDcsImV4cCI6MTY3NzI2OTA0N30.jak0XNbOfp6nNVbaOQONM9aoH9mJ2LlNpDHh3n_1_oY',
    type: 'string',
  })
  refresh_token: string
}
