import { RetrieveDeliveryUseCase } from './retrieve-delivery'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveryStatus } from '../../enterprise/entities/delivery'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDelivererUser } from 'test/factories/make-user'
import { UserNotExistsError } from './errors/user-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: RetrieveDeliveryUseCase

describe('Retrieve Delivery', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new RetrieveDeliveryUseCase(
      inMemoryUsersRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to retrieve a delivery', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: user.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        delivererId: user.id,
        retrievedAt: expect.any(Date),
        status: DeliveryStatus.RETRIEVED,
      }),
    )
  })

  it('should not be able to retrieve a delivery that does not exists', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      delivererId: user.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })

  it('should not be able to retrieve a delivery with a user that does not exists', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: 'user-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UserNotExistsError)
  })
})
