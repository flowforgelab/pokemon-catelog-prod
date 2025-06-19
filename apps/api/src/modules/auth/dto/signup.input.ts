import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength, IsOptional, Matches } from 'class-validator'

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Password must contain uppercase, lowercase, number, and special character' }
  )
  password: string

  @Field({ nullable: true })
  @IsOptional()
  name?: string
}