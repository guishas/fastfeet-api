import { UsersRepository } from '@/domain/delivery/application/repositories/users-repository'
import { User } from '@/domain/delivery/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(userId: string) {
    const user = this.items.find((item) => item.id.stringEquals(userId))

    if (!user) {
      return null
    }

    return user
  }

  async findByDocument(document: string) {
    const user = this.items.find((item) => item.document === document)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id.equals(user.id))

    this.items[itemIndex] = user
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id.equals(user.id))

    this.items.splice(itemIndex, 1)
  }
}
