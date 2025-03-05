import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/entities/user'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { Injectable } from '@nestjs/common'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileResponseRight {
  user: User
}

type GetUserProfileUseCaseResponse = Either<
  UserNotExistsError,
  GetUserProfileResponseRight
>

@Injectable()
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError(userId))
    }

    return right({
      user,
    })
  }
}
