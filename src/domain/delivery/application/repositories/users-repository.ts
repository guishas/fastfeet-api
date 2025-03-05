import { User } from '../../enterprise/entities/user'

export abstract class UsersRepository {
  abstract findById(userId: string): Promise<User | null>
  abstract findByDocument(document: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
