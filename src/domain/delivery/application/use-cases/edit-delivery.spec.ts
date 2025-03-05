import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDelivererUser } from 'test/factories/make-user'
import { EditDeliveryUseCase } from './edit-delivery'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: EditDeliveryUseCase

describe('Edit Delivery', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new EditDeliveryUseCase(
      inMemoryUsersRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to edit a delivery', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: user.id.toValue(),
      recipient: 'John Doe',
      location: delivery.location,
      status: delivery.status,
    })

    expect(result.isRight())
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        recipient: 'John Doe',
      }),
    )
  })

  it('should not be able to edit a delivery that does not exists', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      delivererId: user.id.toValue(),
      recipient: 'John Doe',
      location: delivery.location,
      status: delivery.status,
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })
})
