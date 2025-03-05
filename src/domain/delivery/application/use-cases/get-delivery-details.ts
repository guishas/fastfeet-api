import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { Injectable } from '@nestjs/common'

interface GetDeliveryDetailsUseCaseRequest {
  deliveryId: string
}

interface GetDeliveryDetailsResponseRight {
  delivery: Delivery
}

type GetDeliveryDetailsUseCaseResponse = Either<
  DeliveryNotExistsError,
  GetDeliveryDetailsResponseRight
>

@Injectable()
export class GetDeliveryDetailsUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
  }: GetDeliveryDetailsUseCaseRequest): Promise<GetDeliveryDetailsUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    return right({
      delivery,
    })
  }
}
