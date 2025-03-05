import { FakeHasher } from 'test/crypto/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeAdminUser } from 'test/factories/make-user'
import { ChangeUserPasswordUseCase } from './change-user-password'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UserNotExistsError } from './errors/user-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let sut: ChangeUserPasswordUseCase

describe('Change User Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()

    sut = new ChangeUserPasswordUseCase(inMemoryUsersRepository, hasher, hasher)
  })

  it('should be able to change user password', async () => {
    const user = makeAdminUser({
      document: '397.656.758-28',
      password: await hasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toValue(),
      actualPassword: '123456',
      newPassword: '654321',
    })

    expect(result.isRight())

    const userInDatabase = inMemoryUsersRepository.items[0]
    const doesPasswordsMatch = await hasher.compare(
      '654321',
      userInDatabase.password,
    )

    expect(doesPasswordsMatch).toBeTruthy()
  })

  it('should not be able to change user password with wrong actual password', async () => {
    const user = makeAdminUser({
      document: '397.656.758-28',
      password: await hasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toValue(),
      actualPassword: '654321',
      newPassword: '654321',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to change user password of a user that does not exists', async () => {
    const user = makeAdminUser({
      document: '397.656.758-28',
      password: await hasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: 'user-1',
      actualPassword: '123456',
      newPassword: '654321',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UserNotExistsError)
  })
})
