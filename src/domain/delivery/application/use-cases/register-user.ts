import { Either, left, right } from '@/core/either'
import { UserRole } from '@/core/types/user-roles'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Hasher } from '../crypto/hasher'
import { Admin } from '../../enterprise/entities/admin'
import { Deliverer } from '../../enterprise/entities/deliverer'
import { Injectable } from '@nestjs/common'

interface RegisterUserUseCaseRequest {
  name: string
  document: string
  password: string
  role: UserRole
}

interface RegisterUserResponseRight {
  user: User
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  RegisterUserResponseRight
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    name,
    document,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameDocument =
      await this.usersRepository.findByDocument(document)

    if (userWithSameDocument) {
      return left(new UserAlreadyExistsError(document))
    }

    const hashedPassword = await this.hasher.hash(password)

    if (role === UserRole.ADMIN) {
      const admin = Admin.create({
        name,
        document,
        password: hashedPassword,
      })

      await this.usersRepository.create(admin)

      return right({
        user: admin,
      })
    }

    const deliverer = Deliverer.create({
      name,
      document,
      password: hashedPassword,
    })

    await this.usersRepository.create(deliverer)

    return right({
      user: deliverer,
    })
  }
}
