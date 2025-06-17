import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { UpdateProfileInput } from './dto/update-profile.input'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        collections: {
          include: {
            _count: {
              select: { cards: true },
            },
          },
        },
        decks: {
          include: {
            _count: {
              select: { cards: true },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        username: input.username,
        image: input.image,
      },
    })

    return user
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        collections: {
          where: { isPublic: true },
          include: {
            _count: {
              select: { cards: true },
            },
          },
        },
        decks: {
          where: { isPublic: true },
          include: {
            _count: {
              select: { cards: true },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself')
    }

    const follow = await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    })

    return follow
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    })

    return follow.count > 0
  }

  async getFollowers(userId: string, limit = 20, offset = 0) {
    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })

    return followers.map(f => f.follower)
  }

  async getFollowing(userId: string, limit = 20, offset = 0) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })

    return following.map(f => f.following)
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    return !!follow
  }
}