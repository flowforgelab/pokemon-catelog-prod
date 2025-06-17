import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class CardSuggestion {
  @Field()
  id: string

  @Field()
  name: string
}