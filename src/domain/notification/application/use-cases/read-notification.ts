import { Notification } from '../../enterprise/entities/notification'
import { Either, left, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { NotificationNotExistsError } from './errors/notification-not-exists-error'

export interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

interface ReadNotificationResponseRight {
  notification: Notification
}

export type ReadNotificationUseCaseResponse = Either<
  NotificationNotExistsError | NotAuthorizedError,
  ReadNotificationResponseRight
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new NotificationNotExistsError(notificationId))
    }

    if (!notification.recipientId.stringEquals(recipientId)) {
      return left(new NotAuthorizedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
