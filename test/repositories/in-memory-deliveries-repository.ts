import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/paginated-param'
import { getDistanceBetweenCoordinates } from '@/core/utils/get-distance-between-coordinates'
import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    private deliveryAttachmentsRepository: DeliveryAttachmentsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async findById(deliveryId: string) {
    const delivery = this.items.find((item) => item.id.stringEquals(deliveryId))

    if (!delivery) {
      return null
    }

    return delivery
  }

  async fetchManyByDelivererId(
    delivererId: string,
    { page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.delivererId?.stringEquals(delivererId))
      .slice((page - 1) * 20, page * 20)
  }

  async fetchManyNearby(
    latitude: number,
    longitude: number,
    { page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude,
            longitude,
          },
          {
            latitude: item.location.latitude,
            longitude: item.location.longitude,
          },
        )

        return distance < 7
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }

  async save(delivery: Delivery) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items[itemIndex] = delivery

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async delete(delivery: Delivery) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items.splice(itemIndex, 1)

    await this.deliveryAttachmentsRepository.deleteByDeliveryId(
      delivery.id.toValue(),
    )
  }
}
