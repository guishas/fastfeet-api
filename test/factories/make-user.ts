import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import {
  Deliverer,
  DelivererProps,
} from '@/domain/delivery/enterprise/entities/deliverer'
import { User, UserProps } from '@/domain/delivery/enterprise/entities/user'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUsersMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'

export function makeAdminUser(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const user = Admin.create(
    {
      name: faker.person.fullName(),
      document: faker.number.int({ max: 10000000000 }).toString(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}

export function makeDelivererUser(
  override: Partial<DelivererProps> = {},
  id?: UniqueEntityID,
) {
  const user = Deliverer.create(
    {
      name: faker.person.fullName(),
      document: faker.number.int({ max: 10000000000 }).toString(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivererUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeDelivererUser(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    })

    return user
  }

  async makePrismaAdminUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeAdminUser(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    })

    return user
  }
}
