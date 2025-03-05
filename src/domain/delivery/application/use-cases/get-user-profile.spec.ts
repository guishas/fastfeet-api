import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { makeAdminUser } from 'test/factories/make-user'
import { UserNotExistsError } from './errors/user-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user profile', async () => {
    const user = makeAdminUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      user: expect.objectContaining({
        name: user.name,
        document: user.document,
        password: user.password,
      }),
    })
  })

  it('should not be able to get profile for a user that does not exists', async () => {
    const user = makeAdminUser()

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: 'user-1',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(UserNotExistsError)
  })
})
