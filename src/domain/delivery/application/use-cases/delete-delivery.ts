import { Either, left, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { Injectable } from '@nestjs/common'

interface DeleteDeliveryUseCaseRequest {
  deliveryId: string
}

type DeleteDeliveryUseCaseResponse = Either<DeliveryNotExistsError, object>

@Injectable()
export class DeleteDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: DeleteDeliveryUseCaseRequest): Promise<DeleteDeliveryUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    await this.deliveriesRepository.delete(delivery)

    return right({})
  }
}
