import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsArray, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class SearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supertypes?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rarities?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  setSeries?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  animeEras?: string[]

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minHp?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxHp?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortBy?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortOrder?: string

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 20
}