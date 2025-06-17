import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  email: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  image?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}