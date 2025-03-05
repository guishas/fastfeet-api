import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'
import { makeAdminUser } from 'test/factories/make-user'
import { UserNotExistsError } from './errors/user-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete a user', async () => {
    const user = makeAdminUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a user that does not exists', async () => {
    const user = makeAdminUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: 'user-1',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(UserNotExistsError)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
  })
})
