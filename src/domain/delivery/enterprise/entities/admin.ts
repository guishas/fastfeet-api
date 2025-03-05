import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserRole } from '@/core/types/user-roles'
import { User } from './user'

export interface AdminProps {
  name: string
  document: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Admin extends User {
  static create(props: Optional<AdminProps, 'createdAt'>, id?: UniqueEntityID) {
    const admin = new Admin(
      {
        ...props,
        role: UserRole.ADMIN,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return admin
  }
}
