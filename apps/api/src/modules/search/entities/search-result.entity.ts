import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class SearchCard {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  supertype: string

  @Field(() => [String])
  types: string[]

  @Field({ nullable: true })
  hp?: string

  @Field({ nullable: true })
  rarity?: string

  @Field()
  setName: string

  @Field()
  setSeries: string

  @Field({ nullable: true })
  artist?: string

  @Field({ nullable: true })
  imageSmall?: string

  @Field({ nullable: true })
  imageLarge?: string

  @Field({ nullable: true })
  marketPrice?: number

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  setReleaseDate?: string

  @Field({ nullable: true })
  animeEra?: string

  @Field({ nullable: true })
  tcgplayerUrl?: string
}

@ObjectType()
export class Facet {
  @Field()
  key: string

  @Field(() => Int)
  doc_count: number
}

@ObjectType()
export class SearchFacets {
  @Field(() => [Facet])
  types: Facet[]

  @Field(() => [Facet])
  supertypes: Facet[]

  @Field(() => [Facet])
  rarities: Facet[]

  @Field(() => [Facet])
  setSeries: Facet[]
}

@ObjectType()
export class SearchResult {
  @Field(() => [SearchCard])
  cards: SearchCard[]

  @Field(() => Int)
  total: number

  @Field(() => SearchFacets)
  facets: SearchFacets
}