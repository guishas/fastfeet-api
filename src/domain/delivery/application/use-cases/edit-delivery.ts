import { Either, left, right } from '@/core/either'
import { Delivery, DeliveryStatus } from '../../enterprise/entities/delivery'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UserRole } from '@/core/types/user-roles'
import { AdminCannotDeliverError } from './errors/admin-cannot-deliver-error'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { Injectable } from '@nestjs/common'

interface EditDeliveryUseCaseRequest {
  deliveryId: string
  delivererId?: string | null
  recipient: string
  location: {
    address: string
    neighborhood: string
    city: string
    latitude: number
    longitude: number
  }
  status: DeliveryStatus
}

interface EditDeliveryResponseRight {
  delivery: Delivery
}

type EditDeliveryUseCaseResponse = Either<
  UserNotExistsError | AdminCannotDeliverError | DeliveryNotExistsError,
  EditDeliveryResponseRight
>

@Injectable()
export class EditDeliveryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    deliveryId,
    delivererId,
    recipient,
    location,
    status,
  }: EditDeliveryUseCaseRequest): Promise<EditDeliveryUseCaseResponse> {
    if (delivererId) {
      const user = await this.usersRepository.findById(delivererId)

      if (!user) {
        return left(new UserNotExistsError(delivererId))
      }

      if (user.role === UserRole.ADMIN) {
        return left(new AdminCannotDeliverError())
      }
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    delivery.delivererId = delivererId ? new UniqueEntityID(delivererId) : null
    delivery.recipient = recipient
    delivery.location = location
    delivery.status = status

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
