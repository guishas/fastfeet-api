import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'
import { User } from '@/domain/delivery/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    if (raw.role === 'ADMIN') {
      return Admin.create(
        {
          name: raw.name,
          document: raw.document,
          password: raw.password,
        },
        new UniqueEntityID(raw.id),
      )
    } else {
      return Deliverer.create(
        {
          name: raw.name,
          document: raw.document,
          password: raw.password,
        },
        new UniqueEntityID(raw.id),
      )
    }
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toValue(),
      name: user.name,
      document: user.document,
      password: user.password,
      role: user.role,
    }
  }
}
