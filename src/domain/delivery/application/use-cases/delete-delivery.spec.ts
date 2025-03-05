import { DeleteDeliveryUseCase } from './delete-delivery'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: DeleteDeliveryUseCase

describe('Delete Delivery', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new DeleteDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to delete a delivery', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery that does not exists', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })
})
