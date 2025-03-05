import { Either, left, right } from '@/core/either'
import { Delivery, DeliveryStatus } from '../../enterprise/entities/delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { Injectable } from '@nestjs/common'

interface PrepareDeliveryUseCaseRequest {
  deliveryId: string
}

interface PrepareDeliveryResponseRight {
  delivery: Delivery
}

type PrepareDeliveryUseCaseResponse = Either<
  DeliveryNotExistsError,
  PrepareDeliveryResponseRight
>

@Injectable()
export class PrepareDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: PrepareDeliveryUseCaseRequest): Promise<PrepareDeliveryUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    delivery.preparedAt = new Date()
    delivery.status = DeliveryStatus.AWAITING

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
