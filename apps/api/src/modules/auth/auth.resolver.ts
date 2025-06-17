import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from './entities/user.entity'
import { AuthResponse } from './dto/auth-response.dto'
import { LoginInput } from './dto/login.input'
import { SignupInput } from './dto/signup.input'
import { RefreshTokenInput } from './dto/refresh-token.input'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validateUser(input.email, input.password)
    return this.authService.login(user)
  }

  @Mutation(() => AuthResponse)
  async signup(@Args('input') input: SignupInput) {
    return this.authService.signup(input.email, input.password, input.name)
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    return this.authService.refreshToken(input.refreshToken)
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@Context() context: any) {
    const token = context.req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return false
    }
    return this.authService.logout(token)
  }
}