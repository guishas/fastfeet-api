import { Either, left, right } from '@/core/either'
import { Delivery, DeliveryStatus } from '../../enterprise/entities/delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UsersRepository } from '../repositories/users-repository'
import { NotAuthorizedError } from '../../../../core/errors/not-authorized-error'
import { DeliveryAttachment } from '../../enterprise/entities/delivery-attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { AttachmentNotExistsError } from './errors/attachment-not-exists-error'
import { Injectable } from '@nestjs/common'

interface DeliverDeliveryUseCaseRequest {
  deliveryId: string
  delivererId: string
  attachmentId: string
}

interface DeliverDeliveryResponseRight {
  delivery: Delivery
}

type DeliverDeliveryUseCaseResponse = Either<
  UserNotExistsError | DeliveryNotExistsError,
  DeliverDeliveryResponseRight
>

@Injectable()
export class DeliverDeliveryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deliveriesRepository: DeliveriesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    deliveryId,
    delivererId,
    attachmentId,
  }: DeliverDeliveryUseCaseRequest): Promise<DeliverDeliveryUseCaseResponse> {
    const user = await this.usersRepository.findById(delivererId)

    if (!user) {
      return left(new UserNotExistsError(delivererId))
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    if (!delivery.delivererId) {
      return left(new DeliveryNotExistsError(deliveryId))
    }

    if (!user.id.equals(delivery.delivererId)) {
      return left(new NotAuthorizedError())
    }

    const attachment = await this.attachmentsRepository.findById(attachmentId)

    if (!attachment) {
      return left(new AttachmentNotExistsError(attachmentId))
    }

    const deliveryAttachment = DeliveryAttachment.create({
      deliveryId: delivery.id,
      attachmentId: attachment.id,
    })

    delivery.attachment = deliveryAttachment
    delivery.deliveredAt = new Date()
    delivery.status = DeliveryStatus.DELIVERED

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
