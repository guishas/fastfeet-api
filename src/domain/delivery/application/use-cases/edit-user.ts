import { Either, left, right } from '@/core/either'
import { UserRole } from '@/core/types/user-roles'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { Injectable } from '@nestjs/common'

interface EditUserUseCaseRequest {
  userId: string
  name: string
  document: string
  role: UserRole
}

interface EditUserResponseRight {
  user: User
}

type EditUserUseCaseResponse = Either<UserNotExistsError, EditUserResponseRight>

@Injectable()
export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    document,
    role,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError(userId))
    }

    user.name = name
    user.document = document
    user.role = role

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
