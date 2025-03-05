import { User } from '@/domain/delivery/enterprise/entities/user'

export class UserPresenter {
  static present(user: User) {
    return {
      id: user.id.toValue(),
      name: user.name,
      document: user.document,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
