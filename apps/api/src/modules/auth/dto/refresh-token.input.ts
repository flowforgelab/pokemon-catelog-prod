import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsNotEmpty()
  refreshToken: string
}