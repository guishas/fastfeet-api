import { FetchNearbyPackagesUseCase } from './fetch-nearby-packages'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchNearbyPackagesUseCase

describe('Fetch Nearby Packages', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new FetchNearbyPackagesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch nearby packages', async () => {
    const delivery = makeDelivery({
      location: {
        city: 'New York',
        address: '123 Fake Street',
        neighborhood: 'Brooklyn',
        latitude: -23.638107,
        longitude: -46.683868,
      },
    })

    const delivery2 = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)
    inMemoryDeliveriesRepository.items.push(delivery2)

    const result = await sut.execute({
      latitude: -23.638654,
      longitude: -46.685669,
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.deliveries).toHaveLength(1)
    expect(result.value).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          location: expect.objectContaining({
            city: 'New York',
            address: '123 Fake Street',
          }),
        }),
      ]),
    })
  })
})
