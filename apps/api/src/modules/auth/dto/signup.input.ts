import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator'

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @Field({ nullable: true })
  @IsOptional()
  name?: string
}