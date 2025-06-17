import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User } from '../../auth/entities/user.entity'

@ObjectType()
export class UserProfile extends User {
  @Field(() => Int)
  collectionsCount?: number

  @Field(() => Int)
  decksCount?: number

  @Field(() => Int)
  followersCount?: number

  @Field(() => Int)
  followingCount?: number

  @Field(() => Boolean, { nullable: true })
  isFollowing?: boolean

  @Field(() => [UserCollection], { nullable: true })
  collections?: UserCollection[]

  @Field(() => [UserDeck], { nullable: true })
  decks?: UserDeck[]
}

@ObjectType()
export class UserCollection {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field()
  isPublic: boolean

  @Field(() => Int)
  cardsCount: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class UserDeck {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field()
  format: string

  @Field()
  isPublic: boolean

  @Field(() => Int)
  cardsCount: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}