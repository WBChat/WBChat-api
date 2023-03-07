import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString, Length } from 'class-validator'

export enum UserLevel {
  Trainee = 'Trainee',
  Junior = 'Junior',
  Middle = 'Middle',
  Senior = 'Senior',
  TechArchitector = 'Tech architector',
}

export enum UserDirection {
  Frontend = 'Frontend',
  Backend = 'Backend',
}

export enum UserExperience {
  NoExperience = 'No experience',
  Less_1_Year = 'Less than 1 year',
  _1_3_Years = '1-3 years',
  More_3_Years = 'More than 3 years',
}

@Schema()
export class TUserRegistration {
  @ApiProperty({ example: 'example@example.com', type: 'string' })
  @IsEmail({}, { message: 'Email is not a valid email.' })
  @Prop({ required: true })
  email: string

  @ApiProperty({ example: 'Peter', type: 'string' })
  @IsString({ message: 'First name should be a string.' })
  @Prop({ required: true })
  @Length(2, 20, {
    message: 'First name should be longer than 1 symbols and shorter than 21',
  })
  first_name: string

  @ApiProperty({ example: 'Bowers', type: 'string' })
  @IsString({ message: 'Last name should be a string.' })
  @Prop({ required: true })
  @Length(2, 20, {
    message: 'Last name should be longer than 1 symbols and shorter than 21',
  })
  last_name: string

  @ApiProperty({ example: 'Middle', type: 'string', enum: UserLevel })
  @IsEnum(UserLevel, { message: 'Level is not valid' })
  @Prop({ required: true })
  level: UserLevel

  @ApiProperty({ example: 'Frontend', type: 'string', enum: UserDirection })
  @IsEnum(UserDirection, { message: 'Direction is not valid' })
  @Prop({ required: true })
  direction: UserDirection

  @ApiProperty({
    example: 'No experience',
    type: 'string',
    enum: UserExperience,
  })
  @Prop({ required: true })
  @IsEnum(UserExperience, { message: 'Experience is not valid' })
  experience: UserExperience

  @ApiProperty({ type: 'string' })
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
