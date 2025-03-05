import { FetchUserDeliveriesUseCase } from './fetch-user-deliveries'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDelivererUser } from 'test/factories/make-user'
import { Delivery } from '../../enterprise/entities/delivery'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchUserDeliveriesUseCase

describe('Fetch User Deliveries', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new FetchUserDeliveriesUseCase(
      inMemoryUsersRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to fetch user deliveries', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    for (let i = 0; i < 22; i++) {
      const delivery = makeDelivery({
        delivererId: user.id,
      })

      inMemoryDeliveriesRepository.items.push(delivery)
    }

    const result = await sut.execute({
      delivererId: user.id.toValue(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      (result.value as { deliveries: Delivery[] }).deliveries,
    ).toHaveLength(20)
  })

  it('should be able to fetch paginated user deliveries', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    for (let i = 0; i < 22; i++) {
      const delivery = makeDelivery({
        delivererId: user.id,
      })

      inMemoryDeliveriesRepository.items.push(delivery)
    }

    const result = await sut.execute({
      delivererId: user.id.toValue(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      (result.value as { deliveries: Delivery[] }).deliveries,
    ).toHaveLength(2)
  })

  it('should be able to fetch paginated user deliveries only for the correct user', async () => {
    const user = makeDelivererUser()
    const user2 = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(user2)

    for (let i = 0; i < 22; i++) {
      const delivery = makeDelivery({
        delivererId: i % 2 === 0 ? user.id : user2.id,
      })

      inMemoryDeliveriesRepository.items.push(delivery)
    }

    const result = await sut.execute({
      delivererId: user.id.toValue(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      (result.value as { deliveries: Delivery[] }).deliveries,
    ).toHaveLength(11)
  })
})
