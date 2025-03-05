import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserRole } from '@/core/types/user-roles'
import { User } from './user'

export interface DelivererProps {
  name: string
  document: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Deliverer extends User {
  static create(
    props: Optional<DelivererProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliverer = new Deliverer(
      {
        ...props,
        role: UserRole.DELIVERER,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliverer
  }
}
