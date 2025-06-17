import { Resolver, Query, Mutation, Args, Context, Parent, ResolveField, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../auth/entities/user.entity'
import { UpdateProfileInput } from './dto/update-profile.input'
import { UserProfile } from './entities/user-profile.entity'

@Resolver(() => UserProfile)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserProfile)
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() user: User) {
    return this.userService.findById(user.id)
  }

  @Query(() => UserProfile)
  async userByUsername(@Args('username') username: string) {
    return this.userService.findByUsername(username)
  }

  @Mutation(() => UserProfile)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateProfileInput,
  ) {
    return this.userService.updateProfile(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async followUser(
    @CurrentUser() user: User,
    @Args('userId') userId: string,
  ) {
    await this.userService.followUser(user.id, userId)
    return true
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async unfollowUser(
    @CurrentUser() user: User,
    @Args('userId') userId: string,
  ) {
    return this.userService.unfollowUser(user.id, userId)
  }

  @Query(() => [User])
  async followers(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    return this.userService.getFollowers(userId, limit, offset)
  }

  @Query(() => [User])
  async following(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    return this.userService.getFollowing(userId, limit, offset)
  }

  @ResolveField(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async isFollowing(
    @Parent() userProfile: UserProfile,
    @CurrentUser() currentUser: User,
  ) {
    if (!currentUser || currentUser.id === userProfile.id) {
      return false
    }
    return this.userService.isFollowing(currentUser.id, userProfile.id)
  }
}