import { Either, left, right } from '@/core/either'
import { Delivery, DeliveryStatus } from '../../enterprise/entities/delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { Injectable } from '@nestjs/common'

interface ReturnDeliveryUseCaseRequest {
  deliveryId: string
}

interface ReturnDeliveryResponseRight {
  delivery: Delivery
}

type ReturnDeliveryUseCaseResponse = Either<
  DeliveryNotExistsError,
  ReturnDeliveryResponseRight
>

@Injectable()
export class ReturnDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: ReturnDeliveryUseCaseRequest): Promise<ReturnDeliveryUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    delivery.returnedAt = new Date()
    delivery.status = DeliveryStatus.RETURNED

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
