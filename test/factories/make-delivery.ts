import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryProps,
} from '@/domain/delivery/enterprise/entities/delivery'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliveryMapper } from '@/infra/database/prisma/mappers/prisma-delivery-mapper'

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) {
  const delivery = Delivery.create(
    {
      recipient: faker.person.fullName(),
      location: {
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        neighborhood: faker.location.county(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      ...override,
    },
    id,
  )

  return delivery
}

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(
    data: Partial<DeliveryProps> = {},
  ): Promise<Delivery> {
    const delivery = makeDelivery(data)

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    })

    return delivery
  }
}
