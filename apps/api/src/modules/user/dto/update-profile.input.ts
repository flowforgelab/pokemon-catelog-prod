import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, IsAlphanumeric, MinLength, MaxLength } from 'class-validator'

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(30)
  username?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string
}