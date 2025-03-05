import { FakeHasher } from 'test/crypto/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserUseCase } from './register-user'
import { UserRole } from '@/core/types/user-roles'

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()

    sut = new RegisterUserUseCase(inMemoryUsersRepository, hasher)
  })

  it('should be able to register as a deliverer', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      document: '397.656.758-28',
      password: '123456',
      role: UserRole.DELIVERER,
    })

    expect(result.isRight())
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        document: '397.656.758-28',
        role: UserRole.DELIVERER,
      }),
    )
  })

  it('should be able to register as an admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      document: '397.656.758-28',
      password: '123456',
      role: UserRole.ADMIN,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        document: '397.656.758-28',
        role: UserRole.ADMIN,
      }),
    )
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      document: '397.656.758-28',
      password: '123456',
      role: UserRole.DELIVERER,
    })

    const hashedPassword = await hasher.hash('123456')

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })
})
