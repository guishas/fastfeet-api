import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Comparer } from '../crypto/comparer'
import { Encrypter } from '../crypto/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateUserUseCaseRequest {
  document: string
  password: string
}

interface AuthenticateUserResponseRight {
  accessToken: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  AuthenticateUserResponseRight
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private comparer: Comparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByDocument(document)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordCorrect = await this.comparer.compare(
      password,
      user.password,
    )

    if (!isPasswordCorrect) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toValue(),
      role: user.role,
    })

    return right({
      accessToken,
    })
  }
}
