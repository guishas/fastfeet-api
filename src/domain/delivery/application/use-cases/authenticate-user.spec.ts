import { FakeHasher } from 'test/crypto/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeEncrypter } from 'test/crypto/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeAdminUser } from 'test/factories/make-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      hasher,
      encrypter,
    )
  })

  it('should be able to authenticate as a user', async () => {
    const user = makeAdminUser({
      document: '397.656.758-28',
      password: await hasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      document: '397.656.758-28',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const user = makeAdminUser({
      document: '397.656.758-28',
      password: '123456',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      document: '397.656.758-28',
      password: '12345678',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
