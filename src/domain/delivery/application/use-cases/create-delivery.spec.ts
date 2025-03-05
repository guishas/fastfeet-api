import { CreateDeliveryUseCase } from './create-delivery'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: CreateDeliveryUseCase

describe('Create Delivery', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new CreateDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to create a delivery', async () => {
    const result = await sut.execute({
      recipient: 'John Doe',
      location: {
        city: 'New York',
        address: '123 Fake Street',
        neighborhood: 'Brooklyn',
        latitude: -45.6666,
        longitude: -44.9999,
      },
    })

    expect(result.isRight())
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        location: expect.objectContaining({
          city: 'New York',
        }),
      }),
    )
  })
})
