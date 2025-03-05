import { UsersRepository } from '@/domain/delivery/application/repositories/users-repository'
import { User } from '@/domain/delivery/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaUsersMapper } from '../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async findByDocument(document: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        document,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async create(user: User) {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User) {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(user: User) {
    await this.prisma.user.delete({
      where: {
        id: user.id.toValue(),
      },
    })
  }
}
