import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { UserRole } from '@/core/types/user-roles'
import { makeDelivererUser } from 'test/factories/make-user'
import { UserNotExistsError } from './errors/user-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new EditUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to edit a user', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toValue(),
      name: 'John Doe',
      document: '397.656.758-28',
      role: UserRole.ADMIN,
    })

    expect(result.isRight())
    expect(result.value).toEqual({
      user: expect.objectContaining({
        name: 'John Doe',
        document: '397.656.758-28',
        role: UserRole.ADMIN,
      }),
    })
  })

  it('should not be able to edit a user that does not exists', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      document: '397.656.758-28',
      role: UserRole.ADMIN,
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(UserNotExistsError)
  })
})
