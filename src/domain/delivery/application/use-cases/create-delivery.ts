import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { Injectable } from '@nestjs/common'

interface CreateDeliveryUseCaseRequest {
  recipient: string
  location: {
    address: string
    neighborhood: string
    city: string
    latitude: number
    longitude: number
  }
}

interface CreateDeliveryResponseRight {
  delivery: Delivery
}

type CreateDeliveryUseCaseResponse = Either<null, CreateDeliveryResponseRight>

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    recipient,
    location,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
    const delivery = Delivery.create({
      recipient,
      location,
    })

    await this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
