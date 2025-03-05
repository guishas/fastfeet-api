import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Hasher } from '../crypto/hasher'
import { Comparer } from '../crypto/comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { Injectable } from '@nestjs/common'

interface ChangeUserPasswordUseCaseRequest {
  userId: string
  actualPassword: string
  newPassword: string
}

interface ChangeUserPasswordResponseRight {
  user: User
}

type ChangeUserPasswordUseCaseResponse = Either<
  WrongCredentialsError | UserNotExistsError,
  ChangeUserPasswordResponseRight
>

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private comparer: Comparer,
  ) {}

  async execute({
    userId,
    actualPassword,
    newPassword,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError(userId))
    }

    const doesPasswordsMatch = await this.comparer.compare(
      actualPassword,
      user.password,
    )

    if (!doesPasswordsMatch) {
      return left(new WrongCredentialsError())
    }

    user.password = await this.hasher.hash(newPassword)

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
