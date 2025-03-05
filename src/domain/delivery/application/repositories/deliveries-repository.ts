import { PaginationParams } from '@/core/repositories/paginated-param'
import { Delivery } from '../../enterprise/entities/delivery'

export abstract class DeliveriesRepository {
  abstract findById(deliveryId: string): Promise<Delivery | null>

  abstract fetchManyByDelivererId(
    delivererId: string,
    params: PaginationParams,
  ): Promise<Delivery[]>

  abstract fetchManyNearby(
    latitude: number,
    longitude: number,
    params: PaginationParams,
  ): Promise<Delivery[]>

  abstract create(delivery: Delivery): Promise<void>
  abstract save(delivery: Delivery): Promise<void>
  abstract delete(delivery: Delivery): Promise<void>
}
