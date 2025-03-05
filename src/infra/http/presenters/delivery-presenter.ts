import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

export class DeliveryPresenter {
  static present(delivery: Delivery) {
    return {
      id: delivery.id.toValue(),
      delivererId: delivery.delivererId?.toValue(),
      recipient: delivery.recipient,
      location: delivery.location,
      status: delivery.status,
      createdAt: delivery.createdAt,
      preparedAt: delivery.preparedAt,
      retrievedAt: delivery.retrievedAt,
      deliveredAt: delivery.deliveredAt,
      returnedAt: delivery.returnedAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
