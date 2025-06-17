import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class SearchInput {
  @Field({ nullable: true })
  query?: string

  @Field(() => [String], { nullable: true })
  types?: string[]

  @Field(() => [String], { nullable: true })
  supertypes?: string[]

  @Field(() => [String], { nullable: true })
  rarities?: string[]

  @Field(() => [String], { nullable: true })
  setSeries?: string[]

  @Field(() => Int, { nullable: true })
  minHp?: number

  @Field(() => Int, { nullable: true })
  maxHp?: number

  @Field({ nullable: true })
  sortBy?: string

  @Field({ nullable: true })
  sortOrder?: string

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => Int, { defaultValue: 20 })
  limit: number = 20
}