import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Delivery, DeliveryStatus } from '../entities/delivery'

export class DeliveryStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: Delivery
  public status: DeliveryStatus

  constructor(delivery: Delivery, status: DeliveryStatus) {
    this.ocurredAt = new Date()
    this.delivery = delivery
    this.status = status
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
