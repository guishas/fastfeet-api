import { Entity } from '@/core/entities/entity'
import { UserRole } from '@/core/types/user-roles'

export interface UserProps {
  name: string
  document: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get document() {
    return this.props.document
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  set document(document: string) {
    this.props.document = document

    this.touch()
  }

  set password(password: string) {
    this.props.password = password

    this.touch()
  }

  set role(role: UserRole) {
    this.props.role = role

    this.touch()
  }
}
