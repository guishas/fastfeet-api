import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryStatus,
} from '@/domain/delivery/enterprise/entities/delivery'
import {
  Prisma,
  Delivery as PrismaDelivery,
  DeliveryStatus as PrismaDeliveryStatus,
} from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        delivererId: raw.delivererId
          ? new UniqueEntityID(raw.delivererId)
          : null,
        recipient: raw.recipient,
        location: {
          address: raw.address,
          neighborhood: raw.neighborhood,
          city: raw.city,
          latitude: raw.latitude,
          longitude: raw.longitude,
        },
        status: DeliveryStatus[raw.status],
        preparedAt: raw.preparedAt,
        retrievedAt: raw.retrievedAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toValue(),
      delivererId: delivery.delivererId ? delivery.delivererId.toValue() : null,
      recipient: delivery.recipient,
      address: delivery.location.address,
      neighborhood: delivery.location.neighborhood,
      city: delivery.location.city,
      latitude: delivery.location.latitude,
      longitude: delivery.location.longitude,
      status: PrismaDeliveryStatus[delivery.status],
      preparedAt: delivery.preparedAt,
      retrievedAt: delivery.retrievedAt,
      deliveredAt: delivery.deliveredAt,
      returnedAt: delivery.returnedAt,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
