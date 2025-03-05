import { PrepareDeliveryUseCase } from './prepare-delivery'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveryStatus } from '../../enterprise/entities/delivery'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: PrepareDeliveryUseCase

describe('Prepare Delivery', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new PrepareDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to prepare a delivery', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        preparedAt: expect.any(Date),
        status: DeliveryStatus.AWAITING,
      }),
    )
  })

  it('should not be able to prepare a delivery that does not exists', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })
})
