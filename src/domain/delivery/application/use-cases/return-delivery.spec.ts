import { ReturnDeliveryUseCase } from './return-delivery'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveryStatus } from '../../enterprise/entities/delivery'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDelivererUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: ReturnDeliveryUseCase

describe('Return Delivery', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new ReturnDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to return a delivery', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        delivererId: user.id,
        returnedAt: expect.any(Date),
        status: DeliveryStatus.RETURNED,
      }),
    )
  })

  it('should not be able to return a delivery that does not exists', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })
})
