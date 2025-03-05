import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/paginated-param'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper'
import { Injectable } from '@nestjs/common'
import { Delivery as PrismaDelivery } from '@prisma/client'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(deliveryId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async fetchManyByDelivererId(
    delivererId: string,
    { page }: PaginationParams,
  ) {
    const deliveries = await this.prisma.delivery.findMany({
      where: {
        delivererId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async fetchManyNearby(
    latitude: number,
    longitude: number,
    { page }: PaginationParams,
  ) {
    const deliveries = await this.prisma.$queryRaw<PrismaDelivery[]>`
      SELECT * from deliveries
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
      LIMIT 20
      OFFSET ${(page - 1) * 20}
    `

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async create(delivery: Delivery) {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })
  }

  async save(delivery: Delivery) {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.update({
      where: {
        id: delivery.id.toValue(),
      },
      data,
    })
  }

  async delete(delivery: Delivery) {
    await this.prisma.delivery.delete({
      where: {
        id: delivery.id.toValue(),
      },
    })
  }
}
