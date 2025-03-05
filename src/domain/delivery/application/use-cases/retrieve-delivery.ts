import { Either, left, right } from '@/core/either'
import { Delivery, DeliveryStatus } from '../../enterprise/entities/delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UsersRepository } from '../repositories/users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAuthorizedError } from '../../../../core/errors/not-authorized-error'
import { Injectable } from '@nestjs/common'

interface RetrieveDeliveryUseCaseRequest {
  deliveryId: string
  delivererId: string
}

interface RetrieveDeliveryResponseRight {
  delivery: Delivery
}

type RetrieveDeliveryUseCaseResponse = Either<
  UserNotExistsError | DeliveryNotExistsError | NotAuthorizedError,
  RetrieveDeliveryResponseRight
>

@Injectable()
export class RetrieveDeliveryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    deliveryId,
    delivererId,
  }: RetrieveDeliveryUseCaseRequest): Promise<RetrieveDeliveryUseCaseResponse> {
    const user = await this.usersRepository.findById(delivererId)

    if (!user) {
      return left(new UserNotExistsError(delivererId))
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    delivery.delivererId = new UniqueEntityID(delivererId)
    delivery.retrievedAt = new Date()
    delivery.status = DeliveryStatus.RETRIEVED

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
