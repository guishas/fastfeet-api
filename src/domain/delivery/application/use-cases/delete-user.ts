import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { Injectable } from '@nestjs/common'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<UserNotExistsError, object>

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError(userId))
    }

    await this.usersRepository.delete(user)

    return right({})
  }
}
